import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/layout/Layout';
import { useRehabStore, Exercise } from '../store/useRehabStore';
import { Upload, User2, Sparkles, CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const bodyJoints = ['Knee', 'Shoulder', 'Hip', 'Back', 'Neck', 'Ankle', 'Elbow', 'Wrist'];

export function RecoverySetup() {
  const navigate = useNavigate();
  const { loginOrRegister, submitAssessment, fetchExercisePlans, isLoading, userId } = useRehabStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [painMapping, setPainMapping] = useState<{ [key: string]: number }>({});
  const [patientName, setPatientName] = useState('');
  const [complaint, setComplaint] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [generationError, setGenerationError] = useState('');

  const totalSteps = 5;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const handlePainChange = (joint: string, intensity: number) => {
    setPainMapping((prev) => ({ ...prev, [joint]: intensity }));
  };

  const handleGeneratePlan = async () => {
    setGenerationError('');
    try {
      // Step 1: Register or login the user
      await loginOrRegister(patientName || 'Patient');

      // Build a complaint string from pain areas + doctor notes
      const painAreas = Object.entries(painMapping)
        .filter(([, v]) => v > 0)
        .map(([joint, intensity]) => `${joint} (pain: ${intensity}/10)`)
        .join(', ');

      const maxPain = Math.max(...Object.values(painMapping), 1);
      const fullComplaint = complaint || `Pain in: ${painAreas}. ${doctorNotes ? `Doctor notes: ${doctorNotes}` : ''}`;

      // Step 2: Submit the assessment (calls LLM and saves plans)
      const state = useRehabStore.getState();
      if (state.userId) {
        await submitAssessment(fullComplaint, maxPain);
        await fetchExercisePlans();
      }

      navigate('/dashboard');
    } catch (err: any) {
      setGenerationError(err.message || 'Failed to generate plan. Is the backend running?');
    }
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Create Recovery Plan</h1>
          <p className="text-muted-foreground">
            Complete the setup to generate your personalized rehabilitation plan
          </p>
        </motion.div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index + 1 === currentStep
                      ? 'bg-primary text-white scale-110'
                      : index + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1 < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-12 h-1 ${
                      index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            {currentStep === 1 && (
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <User2 className="w-6 h-6 text-primary" />
                  Patient Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Describe your injury or complaint</label>
                    <textarea
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      rows={4}
                      placeholder="E.g., I have lower back pain after sitting for long hours..."
                      className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-primary" />
                  Upload Medical Scans
                </h2>
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-6">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Drag & drop your medical scans or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-xl cursor-pointer hover:bg-primary/90 transition-all"
                  >
                    Choose Files
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <span className="text-sm">{file}</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6">Pain Mapping</h2>
                <p className="text-muted-foreground mb-6">
                  Select affected areas and rate pain intensity (1-10)
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {bodyJoints.map((joint) => (
                    <div key={joint} className="p-4 bg-gray-50 rounded-xl">
                      <label className="font-medium mb-3 block">{joint}</label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={painMapping[joint] || 0}
                        onChange={(e) => handlePainChange(joint, parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>No pain</span>
                        <span className="font-semibold text-primary">
                          {painMapping[joint] || 0}
                        </span>
                        <span>Severe</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <User2 className="w-6 h-6 text-primary" />
                  Doctor Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block font-medium mb-2">Select Doctor</label>
                    <select
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Choose a doctor</option>
                      <option value="Dr. Sarah Johnson">Dr. Sarah Johnson - Orthopedic</option>
                      <option value="Dr. Michael Chen">Dr. Michael Chen - Sports Medicine</option>
                      <option value="Dr. Emily White">Dr. Emily White - Physical Therapy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Doctor's Notes</label>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      rows={6}
                      placeholder="Enter any special instructions or notes from your doctor..."
                      className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Review & Generate
                </h2>
                <div className="space-y-6 mb-8">
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold mb-2">Patient</h3>
                    <p className="text-muted-foreground">{patientName || 'Not provided'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold mb-2">Complaint</h3>
                    <p className="text-muted-foreground">{complaint || 'Will be inferred from pain areas'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold mb-2">Medical Scans</h3>
                    <p className="text-muted-foreground">{uploadedFiles.length} files uploaded</p>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold mb-2">Pain Areas</h3>
                    <p className="text-muted-foreground">
                      {Object.keys(painMapping).filter((k) => painMapping[k] > 0).length} areas marked
                    </p>
                  </div>
                </div>

                {generationError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {generationError}
                  </div>
                )}

                <button
                  onClick={handleGeneratePlan}
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Rehab Plan
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
          )}
          {currentStep < totalSteps && (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
