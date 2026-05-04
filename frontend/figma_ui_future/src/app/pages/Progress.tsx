import { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useRehabStore } from '../store/useRehabStore';
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { TrendingUp, Target, Flame, Award } from 'lucide-react';
import { motion } from 'motion/react';

export function Progress() {
  const { 
    userStats, 
    chartTrends, 
    muscleDistribution, 
    fetchAnalytics, 
    userId 
  } = useRehabStore();

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  const recoveryScoreData = [
    {
      name: 'Recovery',
      value: userStats.recoveryScore,
      fill: '#2563EB',
    },
  ];

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
              {userStats.recoveryScore > 70 ? "Great progress! Keep up the consistency" : "Starting strong! Consistency is key."}
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
              Accuracy Trend (Last 10 Sessions)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartTrends}>
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
              Recent Session Accuracy
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#2563EB" radius={[8, 8, 0, 0]} />
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
              <BarChart data={muscleDistribution} layout="vertical">
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
          <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl p-6 shadow-lg shadow-primary/20">
            <p className="text-white/80 mb-2">Total Sessions</p>
            <p className="text-4xl font-bold mb-2">{userStats.totalSessions}</p>
            <p className="text-white/90 text-sm">Overall count</p>
          </div>

          <div className="bg-gradient-to-br from-secondary to-teal-600 text-white rounded-2xl p-6 shadow-lg shadow-secondary/20">
            <p className="text-white/80 mb-2">Current Streak</p>
            <p className="text-4xl font-bold mb-2">{userStats.streak} days</p>
            <p className="text-white/90 text-sm">Personal best!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg shadow-purple-600/20">
            <p className="text-white/80 mb-2">Avg Accuracy</p>
            <p className="text-4xl font-bold mb-2">{userStats.averageAccuracy}%</p>
            <p className="text-white/90 text-sm">Quality of movement</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
