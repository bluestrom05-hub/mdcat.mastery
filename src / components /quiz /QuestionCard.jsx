import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswerSelect,
  showResult,
  isCorrect
}) {
  const options = [
    { key: 'A', value: question?.option_a },
    { key: 'B', value: question?.option_b },
    { key: 'C', value: question?.option_c },
    { key: 'D', value: question?.option_d }
  ];

  const getOptionStyle = (key) => {
    if (!showResult) {
      if (selectedAnswer === key) {
        return 'border-blue-500 bg-blue-500/20';
      }
      return 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10';
    }

    if (key === question?.correct_answer) {
      return 'border-green-500 bg-green-500/20';
    }
    if (selectedAnswer === key && !isCorrect) {
      return 'border-red-500 bg-red-500/20';
    }
    return 'border-white/10 bg-white/5 opacity-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      {/* Question */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <p className="text-lg md:text-xl text-white leading-relaxed">
          {question?.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={option.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!showResult ? { scale: 1.01 } : {}}
            whileTap={!showResult ? { scale: 0.99 } : {}}
            onClick={() => !showResult && onAnswerSelect(option.key)}
            disabled={showResult}
            className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${getOptionStyle(option.key)}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              showResult && option.key === question?.correct_answer
                ? 'bg-green-500 text-white'
                : showResult && selectedAnswer === option.key && !isCorrect
                ? 'bg-red-500 text-white'
                : selectedAnswer === option.key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white'
            }`}>
              {option.key}
            </div>
            <span className="text-white flex-1">{option.value}</span>
            
            {showResult && option.key === question?.correct_answer && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
            {showResult && selectedAnswer === option.key && !isCorrect && option.key !== question?.correct_answer && (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showResult && question?.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-400 mb-2">Explanation</p>
                <p className="text-gray-300">{question?.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
