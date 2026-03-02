import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Brain, 
  Clock, 
  Users, 
  Crown,
  FileText
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: "50,000+ MCQs",
    description: "Comprehensive question bank covering all MDCAT subjects with detailed explanations",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "Smart Practice",
    description: "Adaptive learning system that focuses on your weak areas for maximum improvement",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Compete with thousands of students and track your ranking weekly & monthly",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: FileText,
    title: "Past Papers",
    description: "Practice with actual past papers from all boards with timed mock tests",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Target,
    title: "Performance Analytics",
    description: "Detailed insights into your progress with accuracy trends and time analysis",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: Clock,
    title: "Timed Practice",
    description: "Build exam stamina with realistic timer and pressure simulation",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Users,
    title: "Weekly Competition",
    description: "Join weekly challenges and win premium rewards for top performers",
    color: "from-teal-500 to-green-500"
  },
  {
    icon: Crown,
    title: "Premium Benefits",
    description: "Ad-free experience, custom themes, and exclusive features for premium members",
    color: "from-amber-500 to-yellow-500"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-white">To Ace MDCAT</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform is designed specifically for MDCAT aspirants with features that maximize your preparation efficiency
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>

                {/* Hover Glow */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
