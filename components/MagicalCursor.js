"use client";
import React, { useEffect, useRef } from "react";

const MagicalCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Diverse Sizes: Kuch chote, kuch bade particles
        this.size = Math.random() * 4 + 1;
        // Swirly Movement: Magic dust jaisa spiral feel dene ke liye
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.gravity = 0.05; // Halki si niche girne wali feel
        
        // Ginnie Tales Signature Palette (Purple + Pink + Gold)
        const colors = ["#9D4EDD", "#FF4D91", "#FFD166", "#FFFFFF"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.opacity = 1;
        this.angle = Math.random() * Math.PI * 2; // For rotation
        this.spin = Math.random() * 0.2 - 0.1; // Twinkle effect speed
      }

      update() {
        this.speedY += this.gravity; // Gravity makes it look like falling dust
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.012;
        this.angle += this.spin;
        if (this.size > 0.1) this.size -= 0.02;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Magical Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        // --- CREATIVE SHAPE: Drawing a 4-pointed Star ---
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(0, 0 - (this.size * 2));
          ctx.lineTo(0 + (this.size / 4), 0);
        }
        ctx.fill();
        
        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      // 8-10 particles per move for a rich trail
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
};

export default MagicalCursor;