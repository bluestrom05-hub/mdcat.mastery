import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap,
  Stethoscope,
  Bell,
  Settings,
  Crown,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        console.log('User not logged in');
      }
    };
    loadUser();
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['quizSessions'],
    queryFn: () => base44.entities.QuizSession.filter(
      user?.email ? { created_by: user.email } : {},
      '-created_date',
      20
    ),
    enabled: !!user?.email
  });

  const totalQuizzes = sessions.length;
  const totalCorrect = sessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
  const totalQuestions = sessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
  const avgAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
  const totalTime = sessions.reduce((sum, s) => sum + (s.time_taken || 0), 0);

  const stats = [
    { title: "Total Score", value: user?.total_score || 0, icon: Trophy, color: "from-yellow-500/20 to-orange-500/20" },
    { title: "Quizzes Taken", value: totalQuizzes, icon: Target, color: "from-blue-500/20 to-cyan-500/20" },
    { title: "Avg Accuracy", value: `${avgAccuracy}%`, icon: Zap, color: "from-green-500/20 to-emerald-500/20" },
    { title: "Time Spent", value: `${Math.floor(totalTime / 60)}m`, icon: Clock, color: "from-purple-500/20 to-pink-500/20" }
  ];

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col">
        <div className="p-4 lg:p-6 border-b border-white/10">
          <Link to={createPageUrl("Landing")} className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="hidden lg:block text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MDCAT Pro
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { name: 'Dashboard', page: 'Dashboard', icon: Target },
            { name: 'Practice', page: 'Practice', icon: Zap },
            { name: 'Past Papers', page: 'PastPapers', icon: Trophy },
            { name: 'Leaderboard', page: 'Leaderboard', icon: Trophy },
            { name: 'Premium', page: 'Premium', icon: Crown },
          ].map((item) => (
            <Link
              key={item.name}
              to={createPageUrl(item.page)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          ))}
        </nav>

        {user && (
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="hidden lg:block">Logout</span>
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="ml-20 lg:ml-64 min-h-screen p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-gray-400">Ready to continue your MDCAT preparation?</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="icon" className="bg-white/5 border-white/10">
              <Bell className="w-5 h-5 text-gray-400" />
            </Button>
            <Link to={createPageUrl("Profile")}>
              <Button variant="outline" size="icon" className="bg-white/5 border-white/10">
                <Settings className="w-5 h-5 text-gray-400" />
              </Button>
            </Link>
            {user?.premium_status && (
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-xs font-semibold text-black">
                PREMIUM
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <QuickActions />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <RecentActivity sessions={sessions} />
        </motion.div>
      </main>
    </div>
  );
}
