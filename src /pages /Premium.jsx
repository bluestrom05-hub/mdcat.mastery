import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Crown, 
  Check, 
  Sparkles, 
  Palette, 
  Ban,
  Star,
  Zap,
  Shield,
  ArrowLeft,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const features = [
  { icon: Ban, text: "Ad-free experience" },
  { icon: Palette, text: "Full theme customization" },
  { icon: Star, text: "Exclusive premium badge" },
  { icon: Zap, text: "Early access to new features" },
  { icon: Shield, text: "Priority support" },
  { icon: Gift, text: "Monthly reward eligibility" }
];

export default function Premium() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        console.log('User not logged in');
      }
    };
    loadUser();
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    // In production, this would integrate with Stripe/JazzCash/EasyPaisa
    alert('Payment integration would be implemented here. Price: PKR 2,500');
    setLoading(false);
  };

  if (user?.premium_status) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block p-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 mb-6"
          >
            <Crown className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            You're Premium!
          </h1>
          <p className="text-gray-400 mb-8">
            Enjoy all premium features and thank you for supporting MDCAT Pro!
          </p>
          <Link to={createPageUrl("Dashboard")}>
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold">Go Premium</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex p-6 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 mb-6"
          >
            <Crown className="w-16 h-16 text-amber-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Unlock Premium
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get the ultimate MDCAT preparation experience with exclusive features and no distractions
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 overflow-hidden">
            {/* Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                  Lifetime Access
                </span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white">PKR 2,500</span>
                </div>
                <p className="text-gray-400 mt-2">One-time payment • Forever yours</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <feature.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-white">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-6 text-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-xl"
              >
                {loading ? 'Processing...' : 'Upgrade Now'}
              </Button>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 mb-3">Secure payment via</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-white/10 text-sm text-gray-300">Stripe</div>
                  <div className="px-4 py-2 rounded-lg bg-white/10 text-sm text-gray-300">JazzCash</div>
                  <div className="px-4 py-2 rounded-lg bg-white/10 text-sm text-gray-300">EasyPaisa</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-center"
        >
          <Gift className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Monthly Rewards</h2>
          <p className="text-gray-400">
            Top performers on the monthly leaderboard get Premium for FREE! 
            Compete and win your way to premium features.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
