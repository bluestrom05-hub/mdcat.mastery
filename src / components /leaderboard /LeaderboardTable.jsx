import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function LeaderboardTable({ entries = [], currentUserId }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  if (entries.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
        <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No entries yet</p>
        <p className="text-gray-500 text-sm mt-2">Complete quizzes and publish your scores to appear here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`relative p-4 rounded-xl border transition-all hover:scale-[1.01] ${getRankStyle(index + 1)} ${
            entry.user_id === currentUserId ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              {getRankIcon(index + 1)}
            </div>

            {/* User Info */}
            <div className="flex-1 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {(entry.user_name || entry.created_by || 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">
                  {entry.user_name || entry.created_by?.split('@')[0] || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-400">
                  {entry.subject_name || 'General'} • {entry.accuracy?.toFixed(0)}% accuracy
                </p>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{entry.score || 0}</p>
              <p className="text-sm text-gray-400">points</p>
            </div>
          </div>

          {/* Top 3 Glow Effect */}
          {index < 3 && (
            <div className={`absolute inset-0 rounded-xl opacity-20 blur-xl ${
              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
            }`} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
