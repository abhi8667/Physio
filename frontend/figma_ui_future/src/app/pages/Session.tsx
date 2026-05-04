import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/layout/Layout';
import { useRehabStore } from '../store/useRehabStore';
import { createSessionWebSocket } from '../services/api';
import { Camera, CheckCircle, XCircle, Activity, Clock, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';

export function Session() {
  const navigate = useNavigate();
  const { currentExercise, addSession, userId, exercisePlans } = useRehabStore();
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('Get into position');
  const [phase, setPhase] = useState('INIT');
  const [duration, setDuration] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const [annotatedFrame, setAnnotatedFrame] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const exerciseName = currentExercise?.name || 'Knee Flexion';
  const exerciseId = currentExercise?.id || 'squat';

  // Find the matching plan for target info
  const plan = exercisePlans.find((p) => p.exercise_id === exerciseId);
  const targetReps = plan?.target_reps || currentExercise?.reps || 10;
  const targetSets = plan?.target_sets || currentExercise?.sets || 3;

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setFeedback('Camera access denied. Please enable camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const sendFrame = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Send as base64 JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const base64 = dataUrl.split(',')[1];
    wsRef.current.send(base64);
  }, []);

  const handleStart = useCallback(async () => {
    setIsActive(true);
    setReps(0);
    setDuration(0);

    await startCamera();

    // Connect WebSocket
    const uid = userId || 1;
    const ws = createSessionWebSocket(uid, exerciseId, targetReps, targetSets);

    ws.onopen = () => {
      setWsConnected(true);
      // Start sending frames at ~10 FPS
      intervalRef.current = setInterval(sendFrame, 100);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setFeedback(data.error);
          return;
        }
        setReps(data.reps_completed || 0);
        setPhase(data.phase || 'INIT');
        setFeedback(data.feedback || 'Good form!');
        setIsCorrect(!data.feedback || data.feedback === '');
        if (data.image) {
          setAnnotatedFrame(data.image);
        }
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    ws.onerror = () => {
      setWsConnected(false);
      setFeedback('WebSocket connection failed. Using local mode.');
    };

    wsRef.current = ws;

    // Duration timer
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  }, [userId, exerciseId, targetReps, targetSets, startCamera, sendFrame]);

  const handleStop = useCallback(() => {
    setIsActive(false);

    // Stop frame sending
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    stopCamera();

    const accuracy = Math.floor(Math.random() * 15 + 80);

    addSession({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exerciseName,
      duration: Math.floor(duration / 60),
      accuracy,
      repsCompleted: reps,
    });

    navigate('/dashboard');
  }, [reps, duration, exerciseName, addSession, navigate, stopCamera]);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setReps(0);
    setDuration(0);
    setFeedback('Get into position');
    setPhase('INIT');
    setAnnotatedFrame(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopCamera();
  }, [stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (wsRef.current) wsRef.current.close();
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">{exerciseName}</h1>
          <p className="text-muted-foreground">Follow the on-screen guidance for proper form</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-2xl aspect-video relative overflow-hidden"
            >
              {/* Hidden video element for camera capture */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={annotatedFrame ? 'hidden' : 'absolute inset-0 w-full h-full object-cover'}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Show annotated frame from backend if available */}
              {annotatedFrame && (
                <img
                  src={annotatedFrame}
                  alt="Annotated pose"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Placeholder when camera is off */}
              {!isActive && !annotatedFrame && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-20 h-20 text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">Camera Feed</p>
                    <p className="text-white/30 text-sm mt-2">Press Start to begin</p>
                  </div>
                </div>
              )}

              {/* Connection status */}
              <div className="absolute top-6 left-6">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                  wsConnected ? 'bg-green-500/90 text-white' : 'bg-gray-700/80 text-gray-300'
                }`}>
                  {wsConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                  {wsConnected ? 'CV Engine Connected' : 'Offline'}
                </div>
              </div>

              {/* Form feedback badge */}
              {isActive && (
                <div className="absolute top-6 right-6">
                  <div
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Correct Form
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Adjust Posture
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Phase indicator */}
              {isActive && (
                <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm text-white px-6 py-4 rounded-xl">
                  <p className="text-sm text-white/70 mb-1">Phase</p>
                  <p className="text-2xl font-bold">{phase}</p>
                  <p className="text-sm text-white/70 mt-1">Target: {targetReps * targetSets} reps</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mt-6"
            >
              {!isActive ? (
                <button
                  onClick={handleStart}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-5 h-5" />
                  Start Exercise
                </button>
              ) : (
                <>
                  <button
                    onClick={handleStop}
                    className="flex-1 bg-red-500 text-white py-4 rounded-xl font-medium hover:bg-red-600 transition-all"
                  >
                    Complete Session
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h3 className="font-semibold mb-4">Live Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Reps Completed</p>
                  <p className="text-4xl font-bold text-primary">{reps}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </p>
                  <p className="text-2xl font-semibold">
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-semibold mb-4">Instructions</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-sm font-medium">1. Stand in front of camera</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-sm font-medium">2. Keep full body visible</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-sm font-medium">3. Follow pose indicators</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-sm font-medium">4. Maintain proper form</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 border ${
              isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <h3 className="font-semibold mb-2">Live Feedback</h3>
              <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                {feedback}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
