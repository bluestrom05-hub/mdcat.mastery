import React from 'react';
import { motion } from 'framer-motion';
import { Clock, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function QuizHeader({ 
  currentQuestion, 
  totalQuestions, 
  timeRemaining, 
  onExit 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion) / totalQuestions) * 100;
  const isTimeWarning = timeRemaining < 60;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm text-gray-400">Question</p>
              <p className="text-xl font-bold text-white">
                {currentQuestion} <span className="text-gray-500">/ {totalQuestions}</span>
              </p>
            </div>
          </div>

          <motion.div
            animate={{ 
              scale: isTimeWarning ? [1, 1.1, 1] : 1,
              color: isTimeWarning ? '#ef4444' : '#ffffff'
            }}
            transition={{ repeat: isTimeWarning ? Infinity : 0, duration: 1 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isTimeWarning ? 'bg-red-500/20' : 'bg-white/10'
            }`}
          >
            <Clock className={`w-5 h-5 ${isTimeWarning ? 'text-red-400' : 'text-gray-400'}`} />
            <span className={`font-mono text-lg font-bold ${isTimeWarning ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <Progress value={progress} className="h-2 bg-white/10" />
          <motion.div
            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
