import React, { useRef, useEffect, useMemo } from 'react';

// Detect low-end / mobile device
function isLowEndDevice() {
  const isMobile = window.innerWidth < 768;
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  return isMobile || hasLowMemory || hasSlowCPU;
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let frameCount = 0;

    const lowEnd = isLowEndDevice();
    const PARTICLE_COUNT = lowEnd ? 30 : 60; // was 100
    const CONNECT_DISTANCE = lowEnd ? 0 : 100; // disable connections on mobile
    const SKIP_FRAMES = lowEnd ? 2 : 1; // render every Nth frame on low-end

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    };
    window.addEventListener('resize', debouncedResize, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.hue = Math.random() * 60 + 200;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      if (!CONNECT_DISTANCE) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          // Skip sqrt for performance – compare squared distances
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.08 * (1 - dist / CONNECT_DISTANCE)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;
      if (frameCount % SKIP_FRAMES !== 0) return; // throttle on low-end

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // No global shadowBlur – big perf win
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
    };

    animate();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%)' }}
    />
  );
}
