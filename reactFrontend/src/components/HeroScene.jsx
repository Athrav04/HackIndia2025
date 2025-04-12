import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./HeroScene.css";

export default function HeroScene({ onLoad }) {
  const sceneContainerRef = useRef(null);
  const floatingElementsRef = useRef(null);
  const particlesRef = useRef(null);
  const highlightRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const generateParticles = () => {
      const particleCount = window.innerWidth > 768 ? 20 : 12;
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          left: `${Math.random() * 100}%`,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 5,
        });
      }

      setParticles(newParticles);
    };

    generateParticles();

    // Immediately call onLoad to proceed with UI rendering
    if (onLoad) {
      onLoad();
    }

    // Animate the container when it appears
    if (sceneContainerRef.current) {
      gsap.fromTo(
        sceneContainerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        }
      );
    }

    // Animate floating elements
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.children;

      gsap.fromTo(
        elements,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 0.7,
          duration: 1.8,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Create continuous floating animations for each element
      Array.from(elements).forEach((element, index) => {
        gsap.to(element, {
          y: `${10 + index * 5}`,
          x: index % 2 === 0 ? 10 : -10,
          rotation: index % 2 === 0 ? 10 : -5,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });
    }

    // Animate highlight effect
    if (highlightRef.current) {
      gsap.fromTo(
        highlightRef.current,
        { x: "-100%", opacity: 0 },
        {
          x: "100%",
          opacity: 0.3,
          duration: 2.5,
          ease: "power2.inOut",
          delay: 0.8,
          repeat: -1,
          repeatDelay: 5,
        }
      );
    }

    // Handle window resize for responsive particles
    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onLoad]);

  return (
    <div className="hero-scene-container" ref={sceneContainerRef}>
      <div className="premium-background">
        <div className="gradient-overlay"></div>
        <div className="accent-line"></div>
        <div className="highlight-effect" ref={highlightRef}></div>

        {/* Particles */}
        <div className="particles-container" ref={particlesRef}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Floating geometric elements */}
        <div className="floating-elements" ref={floatingElementsRef}>
          <div className="floating-element circle"></div>
          <div className="floating-element square"></div>
          <div className="floating-element triangle"></div>
          <div className="floating-element plus"></div>
        </div>
      </div>
    </div>
  );
}
