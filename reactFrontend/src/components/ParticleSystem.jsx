import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ParticleSystem.css";

export default function ParticleSystem() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(null);

  // Enhanced particle system configuration
  const config = {
    particleCount: 100,
    particleSize: { min: 1, max: 5 },
    particleColor: ["#8BC34A", "#4CAF50", "#2E7D32", "#ffffff", "#C5E1A5"],
    speed: { min: 0.2, max: 1 },
    glowEffect: true,
    connectParticles: true,
    connectionDistance: 150,
    responsive: true,
    particleShapes: ["circle", "square", "triangle"],
    pulseEffect: true,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;

    // Set canvas dimensions
    const setDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Handle window resize
    const handleResize = () => {
      setDimensions();
      if (config.responsive) {
        // Adjust particle count based on screen size
        const density = Math.min(width, height) / 800;
        config.particleCount = Math.floor(100 * density);
        createParticles();
      }
    };

    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        // Choose random shape
        const shape =
          config.particleShapes[
            Math.floor(Math.random() * config.particleShapes.length)
          ];

        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size:
            Math.random() *
              (config.particleSize.max - config.particleSize.min) +
            config.particleSize.min,
          color:
            config.particleColor[
              Math.floor(Math.random() * config.particleColor.length)
            ],
          speedX: (Math.random() - 0.5) * config.speed.max,
          speedY:
            -Math.random() * (config.speed.max - config.speed.min) -
            config.speed.min,
          opacity: 0.2 + Math.random() * 0.5,
          shape: shape,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          pulseSpeed: 0.005 + Math.random() * 0.01,
          initialSize: 0,
        });
      }
    };

    const drawShape = (ctx, particle) => {
      const { x, y, size, shape } = particle;

      switch (shape) {
        case "square":
          ctx.rect(x - size / 2, y - size / 2, size, size);
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(x, y - size / 2);
          ctx.lineTo(x - size / 2, y + size / 2);
          ctx.lineTo(x + size / 2, y + size / 2);
          ctx.closePath();
          break;
        case "circle":
        default:
          ctx.arc(x, y, size, 0, Math.PI * 2);
          break;
      }
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw particles and update positions
      particlesRef.current.forEach((particle, i) => {
        ctx.beginPath();

        // Draw particle based on shape
        drawShape(ctx, particle);

        // Apply color and fill
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Add glow effect if enabled
        if (config.glowEffect) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = particle.color;
        }

        // Pulse effect - change size over time
        if (config.pulseEffect) {
          particle.size += particle.pulseDirection * particle.pulseSpeed;

          // Reverse direction when size limits are reached
          if (
            particle.size <= config.particleSize.min ||
            particle.size >= config.particleSize.max * 1.5
          ) {
            particle.pulseDirection *= -1;
          }
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // If particle goes off screen, reset position
        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        if (particle.x < -10) {
          particle.x = width + 10;
        } else if (particle.x > width + 10) {
          particle.x = -10;
        }

        // Connect particles if enabled
        if (config.connectParticles) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p2 = particlesRef.current[j];
            const distance = Math.hypot(particle.x - p2.x, particle.y - p2.y);

            if (distance < config.connectionDistance) {
              ctx.beginPath();

              // Create gradient lines
              const gradient = ctx.createLinearGradient(
                particle.x,
                particle.y,
                p2.x,
                p2.y
              );
              gradient.addColorStop(0, particle.color);
              gradient.addColorStop(1, p2.color);

              ctx.strokeStyle = gradient;
              ctx.globalAlpha =
                0.2 * (1 - distance / config.connectionDistance);
              ctx.lineWidth = 0.6;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      });

      // Reset shadow settings
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Animation loop
      frameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    setDimensions();
    createParticles();
    animate();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas"></canvas>;
}
