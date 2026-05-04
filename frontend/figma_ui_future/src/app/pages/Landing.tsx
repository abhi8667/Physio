import { Link } from 'react-router';
import { Layout } from '../components/layout/Layout';
import { Activity, Camera, TrendingUp, FileText, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Camera,
    title: 'Real-time Pose Detection',
    description: 'AI-powered camera tracking ensures perfect form during exercises',
  },
  {
    icon: Target,
    title: 'AI Feedback',
    description: 'Get instant corrections and guidance for optimal recovery',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your recovery journey with detailed analytics',
  },
  {
    icon: FileText,
    title: 'Doctor Reports',
    description: 'Generate comprehensive reports to share with your healthcare provider',
  },
];

export function Landing() {
  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-24"
          >
            <div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Recover smarter with AI-powered physiotherapy
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Real-time posture correction, personalized recovery plans, and progress tracking
                all powered by advanced computer vision AI.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/session"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Start Session
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-all"
                >
                  View Demo
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20">
                <div className="bg-gray-900 rounded-2xl aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <p className="text-white/70">Camera Feed Preview</p>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Correct Form
                  </div>

                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                    <p className="text-xs text-white/70">Knee Angle</p>
                    <p className="text-2xl font-bold">92°</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-card p-6 rounded-2xl border border-border/50 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center bg-gradient-to-br from-primary to-purple-600 text-white rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to start your recovery journey?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have accelerated their recovery with AI-powered physiotherapy
            </p>
            <Link
              to="/recovery-setup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-medium hover:bg-white/90 transition-all"
            >
              <Activity className="w-5 h-5" />
              Create Recovery Plan
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
