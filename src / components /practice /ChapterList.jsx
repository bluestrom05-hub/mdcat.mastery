import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChapterList({ chapters = [], subjectName }) {
  if (chapters.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
        <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No chapters available yet</p>
        <p className="text-gray-500 text-sm mt-2">Chapters will be added soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => (
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ x: 5 }}
          className="group"
        >
          <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white font-bold">
                {chapter.chapter_number || index + 1}
              </div>
              <div>
                <h3 className="text-white font-semibold">{chapter.name}</h3>
                <p className="text-sm text-gray-400">
                  {chapter.mcq_count || 0} / 280 MCQs
                </p>
              </div>
            </div>
            
            <Link to={createPageUrl(`Quiz?chapter=${chapter.id}&subject=${subjectName}`)}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 group-hover:scale-105 transition-transform">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
