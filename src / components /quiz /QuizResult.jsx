import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle,
  Share2,
  RotateCcw,
  Home,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuizResult({ 
  result, 
  onRetry, 
  onPublishScore,
  isPublishing
}) {
  const { 
    totalQuestions, 
    correctAnswers, 
    wrongAnswers, 
    score, 
    accuracy, 
    timeTaken 
  } = result;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = () => {
    if (accuracy >= 90) return { text: 'Excellent!', color: 'text-green-400', emoji: '🏆' };
    if (accuracy >= 70) return { text: 'Great Job!', color: 'text-blue-400', emoji: '👏' };
    if (accuracy >= 50) return { text: 'Good Effort!', color: 'text-yellow-400', emoji: '💪' };
    return { text: 'Keep Practicing!', color: 'text-orange-400', emoji: '📚' };
  };

  const grade = getGrade();

  const stats = [
    { icon: Trophy, label: 'Score', value: score, color: 'from-yellow-500 to-orange-500' },
    { icon: Target, label: 'Accuracy', value: `${accuracy.toFixed(0)}%`, color: 'from-blue-500 to-cyan-500' },
    { icon: CheckCircle, label: 'Correct', value: correctAnswers, color: 'from-green-500 to-emerald-500' },
    { icon: XCircle, label: 'Wrong', value: wrongAnswers, color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Result Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {grade.emoji}
          </motion.div>
          <h1 className={`text-4xl font-bold ${grade.color} mb-2`}>
            {grade.text}
          </h1>
          <p className="text-gray-400">
            You completed the quiz in {formatTime(timeTaken)}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-20 border border-white/10 text-center`}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-white" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Performance Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8"
        >
          <div className="flex justify-between mb-3">
            <span className="text-gray-400">Performance</span>
            <span className="text-white font-bold">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="h-4 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                accuracy >= 70 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : accuracy >= 50 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
            />
          </div>
        </motion.div>

        {/* Competition Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-purple-500/30">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Join Weekly Competition</h3>
              <p className="text-gray-400 text-sm">Make your score public and compete with others!</p>
            </div>
          </div>
          <Button
            onClick={onPublishScore}
            disabled={isPublishing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isPublishing ? 'Publishing...' : 'Publish My Score'}
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1 py-6 border-white/20 hover:bg-white/10"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Link to={createPageUrl("Practice")} className="flex-1">
            <Button variant="outline" className="w-full py-6 border-white/20 hover:bg-white/10">
              <Home className="w-5 h-5 mr-2" />
              Practice More
            </Button>
          </Link>
          <Link to={createPageUrl("Leaderboard")} className="flex-1">
            <Button className="w-full py-6 bg-gradient-to-r from-blue-500 to-purple-500">
              <Trophy className="w-5 h-5 mr-2" />
              Leaderboard
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
