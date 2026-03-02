import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, BookOpen, FileText, DollarSign, Layers, Trophy, TrendingUp } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Premium Users', value: stats.premiumUsers || 0, icon: Crown, color: 'from-amber-500 to-yellow-500' },
    { label: 'Total Subjects', value: stats.totalSubjects || 5, icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { label: 'Total MCQs', value: stats.totalMCQs || 0, icon: FileText, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Books', value: stats.totalBooks || 0, icon: Layers, color: 'from-indigo-500 to-purple-500' },
    { label: 'Total Chapters', value: stats.totalChapters || 0, icon: BookOpen, color: 'from-rose-500 to-pink-500' },
    { label: 'Weekly Participants', value: stats.weeklyParticipants || 0, icon: Trophy, color: 'from-orange-500 to-red-500' },
    { label: 'Revenue (PKR)', value: stats.revenue || 0, icon: DollarSign, color: 'from-teal-500 to-green-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-opacity-20 border border-white/10`}
        >
          <div className="flex items-center justify-between mb-3">
            <card.icon className="w-6 h-6 text-white" />
            <TrendingUp className="w-4 h-4 text-white/50" />
          </div>
          <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
          <p className="text-sm text-white/70">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
