"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initStars = useCallback((width: number, height: number) => {
    const count = Math.min(2000, Math.floor((width * height) / 800));
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        size: Math.random() < 0.85 ? Math.random() * 1.2 : Math.random() < 0.95 ? Math.random() * 2 + 1 : Math.random() * 3 + 2,
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, []);

  const spawnShootingStar = useCallback((width: number, height: number) => {
    const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
    const speed = 4 + Math.random() * 6;
    shootingStarsRef.current.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 40 + Math.random() * 30,
      size: 1.5 + Math.random() * 1.5,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
      initStars(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastShootingTime = 0;

    const draw = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const t = timeRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      /* Galaxy haze */
      const grad = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.6);
      grad.addColorStop(0, "rgba(30, 20, 60, 0.08)");
      grad.addColorStop(0.5, "rgba(15, 10, 40, 0.04)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      /* Stars */
      for (const star of starsRef.current) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * twinkle;
        const drift = Math.sin(t * 0.1 + star.twinkleOffset) * 0.3;

        ctx.beginPath();
        ctx.arc(star.x + drift, star.y, star.size * (0.8 + 0.2 * twinkle), 0, Math.PI * 2);

        if (star.size > 2) {
          const glow = ctx.createRadialGradient(
            star.x + drift, star.y, 0,
            star.x + drift, star.y, star.size * 3
          );
          glow.addColorStop(0, `rgba(180, 200, 255, ${alpha})`);
          glow.addColorStop(0.3, `rgba(100, 150, 255, ${alpha * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(star.x + drift - star.size * 3, star.y - star.size * 3, star.size * 6, star.size * 6);
        }

        ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
        ctx.fill();
      }

      /* Shooting stars */
      if (timestamp - lastShootingTime > 4000 + Math.random() * 8000) {
        spawnShootingStar(w, h);
        lastShootingTime = timestamp;
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > s.maxLife) return false;

        const progress = s.life / s.maxLife;
        const fadeIn = Math.min(1, s.life / 5);
        const fadeOut = 1 - Math.pow(progress, 2);
        const alpha = fadeIn * fadeOut;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
        gradient.addColorStop(0, `rgba(200, 220, 255, ${alpha})`);
        gradient.addColorStop(1, "transparent");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.size;
        ctx.stroke();
        return true;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initStars, spawnShootingStar]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
