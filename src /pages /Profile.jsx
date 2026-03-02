import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Crown,
  Settings,
  ArrowLeft,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export default function Profile() {
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
    queryKey: ['userSessions', user?.email],
    queryFn: () => base44.entities.QuizSession.filter(
      { created_by: user.email },
      '-created_date',
      100
    ),
    enabled: !!user?.email
  });

  const stats = React.useMemo(() => {
    const totalQuizzes = sessions.length;
    const totalCorrect = sessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalQuestions = sessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
    const avgAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100) : 0;
    const totalScore = sessions.reduce((sum, s) => sum + (s.score || 0), 0);
    const totalTime = sessions.reduce((sum, s) => sum + (s.time_taken || 0), 0);

    return { totalQuizzes, avgAccuracy, totalScore, totalTime };
  }, [sessions]);

  const subjectStats = React.useMemo(() => {
    const subjects = {};
    sessions.forEach(s => {
      const name = s.subject_name || 'Other';
      if (!subjects[name]) {
        subjects[name] = { correct: 0, total: 0 };
      }
      subjects[name].correct += s.correct_answers || 0;
      subjects[name].total += s.total_questions || 0;
    });
    return Object.entries(subjects).map(([name, data]) => ({
      name,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      total: data.total
    })).sort((a, b) => b.total - a.total);
  }, [sessions]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </div>
            </Link>
            <span className="text-xl font-bold">My Profile</span>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl">
                  {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user?.premium_status && (
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.full_name || 'MDCAT Aspirant'}
              </h1>
              <p className="text-gray-400 mb-3">{user?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user?.premium_status && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold">
                    PREMIUM
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                  {user?.role || 'Student'}
                </span>
              </div>
            </div>

            {!user?.premium_status && (
              <Link to={createPageUrl("Premium")}>
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
                  <Crown className="w-4 h-4 mr-2" />
                  Go Premium
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Score', value: stats.totalScore, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
            { label: 'Quizzes Taken', value: stats.totalQuizzes, icon: Target, color: 'from-blue-500 to-cyan-500' },
            { label: 'Avg Accuracy', value: `${stats.avgAccuracy.toFixed(0)}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { label: 'Time Spent', value: `${Math.floor(stats.totalTime / 3600)}h`, icon: Clock, color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-20 border border-white/10`}
            >
              <stat.icon className="w-6 h-6 text-white mb-2" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-6">Subject Performance</h2>
          
          {subjectStats.length > 0 ? (
            <div className="space-y-4">
              {subjectStats.map((subject, index) => (
                <div key={subject.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{subject.name}</span>
                    <span className="text-gray-400">{subject.accuracy.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.accuracy}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        subject.accuracy >= 70 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : subject.accuracy >= 50 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No subject data yet. Start practicing to see your performance!
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
