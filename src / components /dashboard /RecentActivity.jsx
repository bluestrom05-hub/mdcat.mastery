import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';

export default function RecentActivity({ sessions = [] }) {
  if (sessions.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No recent activity yet</p>
        <p className="text-sm text-gray-500 mt-1">Start practicing to see your progress here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.slice(0, 5).map((session, index) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${session.accuracy >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {session.accuracy >= 70 ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">{session.subject_name || 'Practice Session'}</p>
              <p className="text-sm text-gray-400">
                {session.correct_answers}/{session.total_questions} correct • {session.accuracy?.toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">
              {session.created_date ? format(new Date(session.created_date), 'MMM d, h:mm a') : '-'}
            </p>
            <p className="text-xs text-gray-500">{Math.floor(session.time_taken / 60)}m taken</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
