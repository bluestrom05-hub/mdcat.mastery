import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const boards = [
  { id: 'kpk', name: 'KPK Board', color: 'from-green-500 to-emerald-500' },
  { id: 'federal', name: 'Federal Board', color: 'from-blue-500 to-cyan-500' },
  { id: 'punjab', name: 'Punjab Board', color: 'from-purple-500 to-pink-500' }
];

export default function BoardSelector({ selectedBoard, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {boards.map((board, index) => (
        <motion.button
          key={board.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(board.id)}
          className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
            selectedBoard === board.id
              ? `bg-gradient-to-br ${board.color} border-white/30`
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${selectedBoard === board.id ? 'bg-white/20' : 'bg-white/5'}`}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">{board.name}</span>
          </div>
          
          {selectedBoard === board.id && (
            <motion.div
              layoutId="boardSelector"
              className="absolute inset-0 rounded-xl border-2 border-white/50"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
