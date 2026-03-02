import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const classes = [
  { id: '11', name: 'Class 11', subtitle: 'First Year' },
  { id: '12', name: 'Class 12', subtitle: 'Second Year' }
];

export default function ClassSelector({ selectedClass, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {classes.map((cls, index) => (
        <motion.button
          key={cls.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(cls.id)}
          className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
            selectedClass === cls.id
              ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-white/30'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`p-3 rounded-xl mb-3 ${selectedClass === cls.id ? 'bg-white/20' : 'bg-white/5'}`}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-white text-lg">{cls.name}</span>
            <span className="text-sm text-white/70">{cls.subtitle}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
