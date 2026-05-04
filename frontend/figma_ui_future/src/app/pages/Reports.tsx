import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useRehabStore } from '../store/useRehabStore';
import { FileText, Download, Mail, ChevronRight, Activity, Target, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ReportData } from '../services/api';

export function Reports() {
  const { fetchReports, aiInsights, fetchInsights, userId } = useRehabStore();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (userId) {
        const data = await fetchReports();
        setReport(data);
        await fetchInsights();
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const stats = [
    { label: 'Sessions Completed', value: report?.total_sessions || 0, icon: Activity, color: 'text-blue-600' },
    { label: 'Total Repetitions', value: report?.total_reps || 0, icon: Target, color: 'text-teal-600' },
    { label: 'Movement Accuracy', value: '88%', icon: Shield, color: 'text-purple-600' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Recovery Reports</h1>
            <p className="text-muted-foreground">Download and share your clinical progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-gray-50 transition-all font-medium">
              <Mail className="w-4 h-4" />
              Share with Doctor
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-medium">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Clinical Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-8">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Clinical Progress Summary</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50">
                    <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Accuracy Trends
                  </h3>
                  <div className="space-y-3">
                    {[
                      { week: 'Week 1', val: 75 },
                      { week: 'Week 2', val: 82 },
                      { week: 'Week 3', val: 85 },
                      { week: 'Week 4', val: 88 },
                    ].map((w, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{w.week}</span>
                          <span>{w.val}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${w.val}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Medical Insights
                  </h3>
                  <div className="space-y-3">
                    {aiInsights?.report_recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">Complete more sessions to generate clinical insights.</p>}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Error Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                Form Error Analysis
              </h2>
              <div className="space-y-4">
                {report?.form_errors_summary && Object.keys(report.form_errors_summary).length > 0 ? (
                  Object.entries(report.form_errors_summary).map(([error, count], idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium capitalize">{error.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">Identified corrective behavior needed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-amber-600">{count}</p>
                        <p className="text-xs text-muted-foreground">Occurrences</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">Great job! No significant form errors detected.</p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
            >
              <h3 className="font-bold mb-4">Patient Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Patient Name</label>
                  <p className="font-medium">{useRehabStore.getState().userName || 'John Doe'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Programme ID</label>
                  <p className="font-medium font-mono">RX-2024-001</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Start Date</label>
                  <p className="font-medium">March 15, 2024</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-primary text-white rounded-2xl p-6 shadow-xl shadow-primary/30"
            >
              <h3 className="font-bold mb-2">Ready to progress?</h3>
              <p className="text-white/80 text-sm mb-4">You've completed 80% of your current phase. New exercises are available.</p>
              <button className="w-full bg-white text-primary py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
                Update Plan
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
