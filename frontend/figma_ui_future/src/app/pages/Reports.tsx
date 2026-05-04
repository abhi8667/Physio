import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useRehabStore } from '../store/useRehabStore';
import { FileText, Download, Mail, Send, Calendar, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function Reports() {
  const { sessions, userStats } = useRehabStore();
  const [email, setEmail] = useState('');

  const handleDownload = () => {
    alert('Report downloaded successfully!');
  };

  const handleSendEmail = () => {
    if (email) {
      alert(`Report sent to ${email}`);
      setEmail('');
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Medical Reports</h1>
          <p className="text-muted-foreground">
            Generate and share comprehensive recovery reports with your healthcare provider
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border-2 border-border shadow-lg p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold">Recovery Progress Report</h2>
                  <p className="text-muted-foreground">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Summary
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                      <p className="text-3xl font-bold text-primary">{userStats.totalSessions}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Avg Accuracy</p>
                      <p className="text-3xl font-bold text-primary">{userStats.averageAccuracy}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Recovery Score</p>
                      <p className="text-3xl font-bold text-primary">{userStats.recoveryScore}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-4">Accuracy Trends</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Week 1</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '75%' }} />
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Week 2</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '78%' }} />
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Week 3</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '82%' }} />
                        </div>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Week 4</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '88%' }} />
                        </div>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Session Log
                  </h3>
                  <div className="space-y-3">
                    {sessions.slice(0, 10).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium">{session.exerciseName}</p>
                          <p className="text-sm text-muted-foreground">{session.date}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{session.duration} min</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Reps</p>
                            <p className="font-medium">{session.repsCompleted}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                            <p className="font-medium text-primary">{session.accuracy}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-xl p-6 border border-primary/20">
                  <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <p className="text-sm">
                        Continue focusing on knee stability exercises to improve overall recovery score
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <p className="text-sm">
                        Maintain current session frequency (5 days/week) for optimal progress
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <p className="text-sm">
                        Consider increasing shoulder rotation reps by 20% next week
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <h3 className="font-semibold mb-4">Export Report</h3>
              <button
                onClick={handleDownload}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Generate a printable version of this report
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Share with Doctor
              </h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleSendEmail}
                  className="w-full bg-secondary text-white py-3 rounded-xl font-medium hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Email
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20">
              <h3 className="font-semibold mb-3">Report Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">Last 30 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-medium">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">PDF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">~2.4 MB</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
