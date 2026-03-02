import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  BookOpen, 
  FileText, 
  Trophy, 
  Zap, 
  User, 
  Crown,
  ArrowRight
} from 'lucide-react';

const actions = [
  {
    title: "Practice MCQs",
    description: "Start practicing by subject",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    page: "Practice"
  },
  {
    title: "Past Papers",
    description: "Attempt real exam papers",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    page: "PastPapers"
  },
  {
    title: "Leaderboard",
    description: "See your ranking",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    page: "Leaderboard"
  },
  {
    title: "Weekly Competition",
    description: "Join this week's challenge",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    page: "Competition"
  },
  {
    title: "My Profile",
    description: "View your progress",
    icon: User,
    color: "from-indigo-500 to-purple-500",
    page: "Profile"
  },
  {
    title: "Go Premium",
    description: "Unlock all features",
    icon: Crown,
    color: "from-amber-500 to-yellow-500",
    page: "Premium"
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={createPageUrl(action.page)}>
            <div className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 text-center h-full">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-xs text-gray-400">{action.description}</p>
              
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-white/50" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
