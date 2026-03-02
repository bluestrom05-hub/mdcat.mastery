import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Trophy, 
  Calendar, 
  CalendarDays, 
  Infinity as InfinityIcon,
  Stethoscope,
  ArrowLeft,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';

export default function Leaderboard() {
  const [period, setPeriod] = useState('weekly');
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

  const now = new Date();
  const currentWeek = Math.ceil(now.getDate() / 7);
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: async () => {
      let filter = { is_public: true };
      
      if (period === 'weekly') {
        filter = { ...filter, week_number: currentWeek, year: currentYear };
      } else if (period === 'monthly') {
        filter = { ...filter, month_number: currentMonth, year: currentYear };
      }
      
      return base44.entities.QuizSession.filter(filter, '-score', 100);
    }
  });

  // Aggregate scores by user
  const aggregatedLeaderboard = React.useMemo(() => {
    const userScores = {};
    sessions.forEach(session => {
      const key = session.created_by || session.user_id;
      if (!userScores[key]) {
        userScores[key] = {
          ...session,
          totalScore: 0,
          totalCorrect: 0,
          totalQuestions: 0
        };
      }
      userScores[key].totalScore += session.score || 0;
      userScores[key].totalCorrect += session.correct_answers || 0;
      userScores[key].totalQuestions += session.total_questions || 0;
    });

    return Object.values(userScores)
      .map(u => ({
        ...u,
        score: u.totalScore,
        accuracy: u.totalQuestions > 0 ? (u.totalCorrect / u.totalQuestions) * 100 : 0
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [sessions]);

  const topThree = aggregatedLeaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-900/10 via-purple-900/20 to-pink-900/10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold">Leaderboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Period Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Tabs value={period} onValueChange={setPeriod} className="w-full">
            <TabsList className="w-full bg-white/5 p-1 rounded-xl">
              <TabsTrigger 
                value="weekly" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger 
                value="monthly"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500"
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="alltime"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500"
              >
                <InfinityIcon className="w-4 h-4 mr-2" />
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {/* Second Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-3xl font-bold text-white">
                  {(topThree[1]?.created_by || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gray-400">
                  <Medal className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="mt-3 font-semibold text-white truncate max-w-full">
                {topThree[1]?.created_by?.split('@')[0] || 'User'}
              </p>
              <p className="text-xl font-bold text-gray-300">{topThree[1]?.score}</p>
              <div className="h-24 w-full mt-2 rounded-t-xl bg-gradient-to-b from-gray-400/30 to-gray-500/30 border-t-2 border-gray-400" />
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-yellow-500/30">
                  {(topThree[0]?.created_by || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-yellow-400">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <p className="mt-3 font-semibold text-white truncate max-w-full">
                {topThree[0]?.created_by?.split('@')[0] || 'User'}
              </p>
              <p className="text-2xl font-bold text-yellow-400">{topThree[0]?.score}</p>
              <div className="h-32 w-full mt-2 rounded-t-xl bg-gradient-to-b from-yellow-400/30 to-amber-500/30 border-t-2 border-yellow-400" />
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-2xl font-bold text-white">
                  {(topThree[2]?.created_by || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-600">
                  <Award className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="mt-3 font-semibold text-white truncate max-w-full">
                {topThree[2]?.created_by?.split('@')[0] || 'User'}
              </p>
              <p className="text-lg font-bold text-amber-500">{topThree[2]?.score}</p>
              <div className="h-16 w-full mt-2 rounded-t-xl bg-gradient-to-b from-amber-600/30 to-orange-500/30 border-t-2 border-amber-600" />
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Rankings</h2>
          <LeaderboardTable 
            entries={aggregatedLeaderboard} 
            currentUserId={user?.id} 
          />
        </motion.div>
      </main>
    </div>
  );
}
