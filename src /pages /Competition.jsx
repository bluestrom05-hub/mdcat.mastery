import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Zap, 
  Trophy, 
  Users, 
  Clock, 
  ArrowLeft,
  Gift,
  Crown,
  Target,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Competition() {
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  // Calculate time until end of week
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      const diff = endOfWeek - now;
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const now = new Date();
  const currentWeek = Math.ceil(now.getDate() / 7);

  const { data: sessions = [] } = useQuery({
    queryKey: ['weeklyCompetition', currentWeek],
    queryFn: () => base44.entities.QuizSession.filter(
      { is_public: true, week_number: currentWeek, year: now.getFullYear() },
      '-score',
      10
    )
  });

  const prizes = [
    { rank: 1, prize: '1 Month Premium FREE', icon: Crown, color: 'from-yellow-500 to-amber-500' },
    { rank: 2, prize: '2 Weeks Premium FREE', icon: Trophy, color: 'from-gray-400 to-gray-500' },
    { rank: 3, prize: '1 Week Premium FREE', icon: Trophy, color: 'from-amber-600 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">Weekly Competition</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6"
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Week {currentWeek} Competition
          </h1>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Compete with fellow aspirants, climb the leaderboard, and win Premium rewards!
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={item.label} className="text-center">
                <motion.div
                  key={item.value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 flex items-center justify-center text-2xl md:text-3xl font-bold text-white"
                >
                  {item.value.toString().padStart(2, '0')}
                </motion.div>
                <p className="text-xs text-gray-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <Link to={createPageUrl("Practice")}>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6">
              <Target className="w-5 h-5 mr-2" />
              Start Practicing
            </Button>
          </Link>
        </motion.div>

        {/* Prizes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            Weekly Prizes
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.rank}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${prize.color} bg-opacity-20 border border-white/10 text-center`}
              >
                <div className="inline-flex p-3 rounded-xl bg-white/20 mb-3">
                  <prize.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-white/70 mb-1">#{prize.rank} Place</p>
                <p className="font-bold text-white">{prize.prize}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current Standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Current Standings
          </h2>
          
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border transition-all ${
                    index < 3 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-white/10 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {session.created_by?.split('@')[0] || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-400">{session.subject_name || 'General'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{session.score}</p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No participants yet this week</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to compete!</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
