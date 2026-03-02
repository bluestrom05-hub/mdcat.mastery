import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function SubjectCard({ subject, icon: Icon, color, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${color} border border-white/20`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Floating Particles */}
        <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
        <div className="absolute bottom-2 left-2 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <ChevronRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
          
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span>15 Chapters</span>
            <span>•</span>
            <span>4,200+ MCQs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
