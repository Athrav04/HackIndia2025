import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data";
import "./HomePage.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "../components/HeroScene";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const heroRef = useRef(null);
  const observerRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroCTARef = useRef(null);
  const mouseCursorRef = useRef(null);
  const mouseCursorDotRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const [hero3DLoaded, setHero3DLoaded] = useState(false);

  // Handle 3D scene load completion
  const handleHero3DLoaded = () => {
    setHero3DLoaded(true);
    // Animate hero content elements when 3D is loaded
    animateHeroContent();
  };

  // Separate function for hero content animation to avoid code duplication
  const animateHeroContent = () => {
    const tl = gsap.timeline();

    if (heroContentRef.current) {
      tl.to(heroContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });
    }

    // Letter by letter animation for the title text
    if (heroTitleRef.current) {
      // Get the current text content
      const titleText = heroTitleRef.current.textContent;
      // Clear the element
      heroTitleRef.current.textContent = "";

      // Create span for each letter
      [...titleText].forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(20px)";
        span.style.setProperty("--index", index); // Add index as CSS variable for hover animation
        heroTitleRef.current.appendChild(span);
      });

      // Animate each letter
      gsap.to(heroTitleRef.current.children, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
      });
    }

    // Animate subtitle and CTA button
    if (heroSubtitleRef.current) {
      gsap.to(heroSubtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "power2.out",
      });
    }

    if (heroCTARef.current) {
      gsap.to(heroCTARef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1,
        ease: "power2.out",
      });
    }
  };

  // Mouse follow animation
  const handleMouseMove = (e) => {
    if (mouseCursorRef.current && mouseCursorDotRef.current) {
      gsap.to(mouseCursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to(mouseCursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power3.out",
      });
    }
  };

  // Update scroll progress
  const updateScrollProgress = () => {
    if (scrollProgressRef.current) {
      const scrollTotal =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollAmount = window.scrollY;
      const scrollPercentage = (scrollAmount / scrollTotal) * 100;
      scrollProgressRef.current.style.width = `${scrollPercentage}%`;
    }
  };

  useEffect(() => {
    // Pre-set opacity and position for smooth reveal
    if (heroTitleRef.current && heroSubtitleRef.current && heroCTARef.current) {
      gsap.set(
        [heroTitleRef.current, heroSubtitleRef.current, heroCTARef.current],
        {
          opacity: 0,
          y: 30,
        }
      );
    }

    // Set overall hero content opacity to 0 until 3D scene loads
    if (heroContentRef.current) {
      gsap.set(heroContentRef.current, {
        opacity: 0,
        y: 20,
      });
    }

    // Add subtle parallax effect to hero section
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const scrollSpeed = 0.2; // Reduced speed for more subtle effect
        heroRef.current.style.backgroundPositionY = `${
          scrollPosition * scrollSpeed
        }px`;
      }
    };

    // Observe all elements with animate class
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate");
    elements.forEach((el) => {
      observer.observe(el);
      observerRefs.current.push(el);
    });

    // Add scroll event for parallax
    window.addEventListener("scroll", handleScroll);

    // Define handleClick function
    const handleClick = () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    };

    // Add click event to scroll indicator
    const scrollIndicator = scrollIndicatorRef.current;
    if (scrollIndicator) {
      scrollIndicator.addEventListener("click", handleClick);
    }

    // Animate sections on scroll
    const sections = document.querySelectorAll("section:not(.hero)");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Animate heading text reveal on scroll
    const sectionHeadings = document.querySelectorAll("section:not(.hero) h2");
    sectionHeadings.forEach((heading) => {
      const textContent = heading.textContent;
      heading.innerHTML = "";

      // Create span for each letter
      [...textContent].forEach((letter) => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? " " : letter;
        span.style.display = letter === " " ? "inline" : "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(20px)";
        heading.appendChild(span);
      });

      // Create text animation on scroll
      gsap.to(heading.children, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Mouse follow effect
    window.addEventListener("mousemove", handleMouseMove);

    // Cursor hover effect on buttons and links
    const interactiveElements = document.querySelectorAll(
      "button, a, .benefit-card, .testimonial"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (mouseCursorRef.current) {
          mouseCursorRef.current.classList.add("cursor-hover");
        }
      });

      el.addEventListener("mouseleave", () => {
        if (mouseCursorRef.current) {
          mouseCursorRef.current.classList.remove("cursor-hover");
        }
      });
    });

    // Scroll progress indicator
    window.addEventListener("scroll", updateScrollProgress);

    // Initial call to set progress
    updateScrollProgress();

    // Cleanup
    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
      window.removeEventListener("scroll", handleScroll);

      if (scrollIndicator) {
        scrollIndicator.removeEventListener("click", handleClick);
      }

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("mousemove", handleMouseMove);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", () => {});
        el.removeEventListener("mouseleave", () => {});
      });

      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  return (
    <div className="home-page">
      <Header />

      {/* Scroll progress indicator */}
      <div className="scroll-progress" ref={scrollProgressRef}></div>

      {/* Custom mouse cursor */}
      <div className="cursor" ref={mouseCursorRef}></div>
      <div className="cursor-dot" ref={mouseCursorDotRef}></div>

      <main>
        <section className="hero" ref={heroRef}>
          {/* Premium background scene */}
          <HeroScene onLoad={handleHero3DLoaded} />

          {/* Hero content */}
          <div className="hero-content" ref={heroContentRef} style={{ visibility: hero3DLoaded ? 'visible' : 'hidden' }}>
            <h1 ref={heroTitleRef}>ECO-verse</h1>
            <p ref={heroSubtitleRef}>
              Sustainable living for a better tomorrow
            </p>
            <div className="hero-cta-container" ref={heroCTARef}>
              <button className="cta-button primary">Explore Products</button>
              <button className="cta-button secondary">Learn More</button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator" ref={scrollIndicatorRef}>
            <span>Discover</span>
            <div className="scroll-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="section-decorator leaf-1"></div>
          <div className="section-decorator dots"></div>
          <div className="container">
            <h2 className="animate fade-in-up">Our Mission</h2>
            <p className="hinglish-intro animate fade-in-up delay-1">
              At ECO-verse, we offer sustainable and eco-friendly products that
              make your lifestyle greener. Our team, driven by pure passion,
              designs products that are beneficial for the environment and also
              beautify your home. With ECO-verse, green living is not just a
              choice, but a way of life!
            </p>
          </div>
        </section>

        <section id="products" className="products-section">
          <div className="section-decorator circle-pattern"></div>
          <div className="section-decorator line-through"></div>
          <div className="container">
            <h2 className="animate fade-in-up">Our Eco-Friendly Products</h2>
            <p className="animate fade-in-up delay-1">
              Discover our selection of handpicked sustainable products for
              everyday life.
            </p>

            <div className="products-grid">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate visible fade-in-up"
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default HomePage;
