import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowRight, Stethoscope, GraduationCap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Doctor3D from './Doctor3D';

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Stay strong docs 💙 One day you'll surely be successful.";
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    // Use a longer interval to reduce re-renders (40ms → 60ms)
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, []);

  // Lighter tween instead of spring – less CPU on mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const stats = [
    { icon: Stethoscope, label: "Future Doctors", value: "10K+" },
    { icon: GraduationCap, label: "MCQs Available", value: "50K+" },
    { icon: Trophy, label: "Success Rate", value: "92%" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Pakistan's #1 MDCAT Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Master MDCAT
            </span>
            <br />
            <span className="text-white">
              With Confidence
            </span>
          </motion.h1>

          {/* Typing Text */}
          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-300 font-light min-h-[60px]">
              {displayedText}
              {!isTypingComplete && (
                <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
              )}
            </p>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0"
          >
            Practice with thousands of MCQs, compete with fellow aspirants, and track your progress to medical school success.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
          >
            <Link to={createPageUrl("Dashboard")}>
              <Button className="group relative px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-xl overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Removed blur overlay – heavy on GPU */}
              </Button>
            </Link>
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" className="px-8 py-6 text-lg border-white/20 hover:bg-white/10 rounded-xl backdrop-blur-sm">
                Explore Features
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content - 3D, fade in only (no scale = no layout recalc) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <Doctor3D />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
