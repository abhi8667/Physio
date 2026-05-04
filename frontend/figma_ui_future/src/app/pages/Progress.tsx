import { Layout } from '../components/layout/Layout';
import { useRehabStore } from '../store/useRehabStore';
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PolarAngleAxis } from 'recharts';
import { TrendingUp, Target, Flame, Award } from 'lucide-react';
import { motion } from 'motion/react';

const accuracyTrend = [
  { date: 'Week 1', accuracy: 75 },
  { date: 'Week 2', accuracy: 78 },
  { date: 'Week 3', accuracy: 82 },
  { date: 'Week 4', accuracy: 88 },
];

const dailyActivity = [
  { day: 'Mon', sessions: 2 },
  { day: 'Tue', sessions: 1 },
  { day: 'Wed', sessions: 3 },
  { day: 'Thu', sessions: 2 },
  { day: 'Fri', sessions: 1 },
  { day: 'Sat', sessions: 2 },
  { day: 'Sun', sessions: 1 },
];

const recoveryScoreData = [
  {
    name: 'Recovery',
    value: 72,
    fill: '#2563EB',
  },
];

const muscleFocus = [
  { muscle: 'Knee', sessions: 12 },
  { muscle: 'Shoulder', sessions: 8 },
  { muscle: 'Hip', sessions: 6 },
  { muscle: 'Back', sessions: 4 },
  { muscle: 'Ankle', sessions: 3 },
];

export function Progress() {
  const { userStats } = useRehabStore();

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Progress & Analytics</h1>
          <p className="text-muted-foreground">Track your recovery journey and performance metrics</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
          >
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Recovery Score
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="100%"
                data={recoveryScoreData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill="#2563EB"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold text-4xl"
                  fill="#2563EB"
                >
                  {userStats.recoveryScore}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Great progress! Keep up the consistency
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
          >
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Accuracy Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
          >
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Daily Activity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="sessions" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
          >
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Muscle Focus Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={muscleFocus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="muscle" type="category" stroke="#888" />
                <Tooltip />
                <Bar dataKey="sessions" fill="#14B8A6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl p-6">
            <p className="text-white/80 mb-2">Total Sessions</p>
            <p className="text-4xl font-bold mb-2">{userStats.totalSessions}</p>
            <p className="text-white/90 text-sm">+12% from last month</p>
          </div>

          <div className="bg-gradient-to-br from-secondary to-teal-600 text-white rounded-2xl p-6">
            <p className="text-white/80 mb-2">Current Streak</p>
            <p className="text-4xl font-bold mb-2">{userStats.streak} days</p>
            <p className="text-white/90 text-sm">Personal best!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6">
            <p className="text-white/80 mb-2">Avg Accuracy</p>
            <p className="text-4xl font-bold mb-2">{userStats.averageAccuracy}%</p>
            <p className="text-white/90 text-sm">+5% improvement</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
