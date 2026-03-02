import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
const isLowEnd = () => {
  if (typeof window === 'undefined') return false;
  const mobile = window.innerWidth < 768;
  const lowMem = navigator.deviceMemory && navigator.deviceMemory <= 2;
  return mobile || lowMem;
};

// Memoized static orb – no re-renders
const Orb = memo(function Orb({ className, delay, size = 'w-16 h-16' }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.7 }}
      className={`${className} ${size} rounded-full`}
      style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.7), rgba(139,92,246,0.7))',
        boxShadow: '0 0 30px rgba(59,130,246,0.4)',
        willChange: 'transform',
      }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ willChange: 'transform' }}
      />
    </motion.div>
  );
});

// Simplified DNA – fewer nodes, CSS animation instead of framer per-node
const DNAHelix = memo(function DNAHelix({ lite }) {
  const nodeCount = lite ? 8 : 14;
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }).map((_, i) => {
      const angle = (i / nodeCount) * Math.PI * 4;
      const y = (i / nodeCount) * 240 - 120;
      return { i, angle, y, x1: Math.cos(angle) * 36, x2: Math.cos(angle + Math.PI) * 36 };
    });
  }, [nodeCount]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="relative w-28 h-60"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {nodes.map(({ i, y, x1, x2 }) => (
          <React.Fragment key={i}>
            <div
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `calc(50% + ${x1}px - 6px)`,
                top: `calc(50% + ${y}px - 6px)`,
                background: '#3b82f6',
                boxShadow: '0 0 8px rgba(59,130,246,0.5)',
              }}
            />
            <div
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `calc(50% + ${x2}px - 6px)`,
                top: `calc(50% + ${y}px - 6px)`,
                background: '#8b5cf6',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
              }}
            />
            {i % 3 === 0 && (
              <div
                className="absolute h-px"
                style={{
                  left: `calc(50% + ${Math.min(x1, x2)}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: `${Math.abs(x1 - x2)}px`,
                  background: 'linear-gradient(90deg, #f472b6, #ec4899)',
                  opacity: 0.7,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
});

const FloatingParticle = memo(function FloatingParticle({ x, y, size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y,
        width: size, height: size,
        background: 'rgba(99,102,241,0.5)',
        willChange: 'transform, opacity',
      }}
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
});

export default function Doctor3D() {
  const lite = isLowEnd();
  const particleCount = lite ? 5 : 10;

  const particles = useMemo(() =>
    Array.from({ length: particleCount }).map((_, i) => ({
      delay: i * 0.3,
      x: `${12 + (i * 7) % 76}%`,
      y: `${15 + (i * 11) % 70}%`,
      size: 4 + (i % 4) * 2,
    })), [particleCount]);

  return (
    <div className="w-full h-[440px] md:h-[540px] relative overflow-hidden">
      {/* Static glow blobs – GPU composited, no JS animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl" />
      {!lite && (
        <>
          <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Particles */}
      {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* DNA */}
      <DNAHelix lite={lite} />

      {/* Orbs */}
      <Orb className="absolute top-1/4 left-1/4" delay={0.2} />
      {!lite && (
        <>
          <Orb className="absolute top-1/2 right-1/4" size="w-12 h-12" delay={0.4} />
          <Orb className="absolute bottom-1/4 left-1/3" size="w-14 h-14" delay={0.6} />
        </>
      )}

      {/* Medical cross */}
      <motion.div
        className="absolute top-16 right-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
        <div className="relative">
          <div className="w-3 h-10 rounded-sm bg-red-500" style={{ boxShadow: '0 0 15px rgba(239,68,68,0.5)' }} />
          <div className="absolute top-3 -left-3.5 w-10 h-3 rounded-sm bg-red-500" style={{ boxShadow: '0 0 15px rgba(239,68,68,0.5)' }} />
        </div>
      </motion.div>

      {/* Heartbeat */}
      <motion.div
        className="absolute bottom-16 left-10 w-10 h-10 rounded-full bg-rose-500"
        animate={{ scale: [1, 1.15, 1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 20px rgba(244,63,94,0.5)', willChange: 'transform' }}
      />
    </div>
  );
}
