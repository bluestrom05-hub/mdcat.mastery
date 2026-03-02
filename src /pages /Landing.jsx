import React from 'react';
import ParticleBackground from '../components/landing/ParticleBackground';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import SubjectsSection from '../components/landing/SubjectsSection';
import CTASection from '../components/landing/CTASection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Stethoscope } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      <ParticleBackground />
      
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl("Landing")} className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MDCAT Pro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to={createPageUrl("Practice")} className="text-gray-300 hover:text-white transition-colors">
              Practice
            </Link>
            <Link to={createPageUrl("PastPapers")} className="text-gray-300 hover:text-white transition-colors">
              Past Papers
            </Link>
            <Link to={createPageUrl("Leaderboard")} className="text-gray-300 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link to={createPageUrl("Premium")} className="text-gray-300 hover:text-white transition-colors">
              Premium
            </Link>
          </div>

          <Link 
            to={createPageUrl("Dashboard")}
            className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <CTASection />

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 MDCAT Pro. Made with 💙 for future doctors of Pakistan.</p>
        </div>
      </footer>
    </div>
  );
}
