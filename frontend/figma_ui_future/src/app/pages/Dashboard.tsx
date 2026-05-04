import { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/cards/StatsCard';
import { useRehabStore } from '../store/useRehabStore';
import { Activity, Target, TrendingUp, Flame, Clock, CheckCircle, Dumbbell, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Dashboard() {
  const { 
    userStats, 
    sessions, 
    exercisePlans, 
    catalogueExercises, 
    heatmapData,
    aiInsights,
    fetchExercises, 
    fetchExercisePlans, 
    fetchAnalytics,
    fetchInsights,
    userId 
  } = useRehabStore();

  useEffect(() => {
    fetchExercises();
    if (userId) {
      fetchExercisePlans();
      fetchAnalytics();
      fetchInsights();
    }
  }, [userId]);

  // Map exercise_id to name from catalogue
  const getExerciseName = (exerciseId: string) => {
    const found = catalogueExercises.find((e) => e.id === exerciseId);
    return found ? found.name : exerciseId;
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your recovery progress overview</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Sessions Completed"
            value={userStats.totalSessions}
            icon={Activity}
            trend={sessions.length > 0 ? "+1 recently" : "Start your first session"}
            trendUp={true}
          />
          <StatsCard
            title="Average Accuracy"
            value={`${userStats.averageAccuracy}%`}
            icon={Target}
            trend={userStats.averageAccuracy > 80 ? "Great form!" : "Focus on posture"}
            trendUp={userStats.averageAccuracy > 80}
          />
          <StatsCard
            title="Recovery Score"
            value={userStats.recoveryScore}
            icon={TrendingUp}
            gradient={true}
          />
          <StatsCard
            title="Current Streak"
            value={`${userStats.streak} days`}
            icon={Flame}
            trend={userStats.streak > 0 ? "Keep it going!" : "Start a new streak"}
            trendUp={userStats.streak > 0}
          />
        </motion.div>

        {/* Active Exercise Plans from API */}
        {exercisePlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl p-6 border border-primary/20 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              Your AI-Generated Exercise Plan
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercisePlans.map((plan, idx) => (
                <Link
                  key={idx}
                  to="/session"
                  onClick={() => useRehabStore.getState().setCurrentExercise({
                    id: plan.exercise_id,
                    name: getExerciseName(plan.exercise_id),
                    targetMuscle: 'Target Area',
                    difficulty: 'beginner',
                    sets: plan.target_sets,
                    reps: plan.target_reps
                  })}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-all border border-border/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{getExerciseName(plan.exercise_id)}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {Math.round(plan.confidence * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {plan.target_sets} sets × {plan.target_reps} reps
                  </p>
                  {plan.caution && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                      ⚠ {plan.caution}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Weekly Activity Heatmap</h2>
            <div className="space-y-2">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-2">
                  {week.map((intensity, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`flex-1 h-12 rounded-lg transition-colors ${
                        intensity === 0
                          ? 'bg-gray-100'
                          : intensity === 1
                          ? 'bg-primary/40 shadow-sm'
                          : 'bg-primary shadow-md'
                      }`}
                      title={`${intensity} sessions`}
                    />
                  ))}
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                {weekDays.map((day) => (
                  <div key={day} className="flex-1 text-center text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              AI Suggestions
            </h3>
            <div className="space-y-4">
              {aiInsights?.dashboard_suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10">
                  <p className="text-sm font-medium text-foreground">{suggestion}</p>
                </div>
              )) || (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Complete a session to get AI suggestions</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6">Recent Sessions</h2>
          <div className="space-y-3">
            {sessions.length > 0 ? (
              sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{getExerciseName(session.exerciseName)}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.duration} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {session.repsCompleted} reps
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">{session.accuracy}%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sessions recorded yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
