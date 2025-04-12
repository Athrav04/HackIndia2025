import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import BenefitsSection from "./BenefitsSection";
import ProductCard from "../components/ProductCard";
import AboutSection from "../components/AboutSection";
import products from "../data";
import "./HomePage.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "../components/HeroScene";
import EcoFacts from "../components/EcoFacts";

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

  // Track hero section loading state
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

    document.querySelectorAll(".animate").forEach((el) => {
      observer.observe(el);
      observerRefs.current.push(el);
    });

    // Add scroll event for parallax
    window.addEventListener("scroll", handleScroll);

    // Add click event to scroll indicator
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.addEventListener("click", () => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      });
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

    // Animate benefit cards with staggered appearance
    gsap.from(".benefit-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".benefits-grid",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate testimonial cards with staggered appearance
    gsap.from(".testimonial", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".testimonials-grid",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Product cards hover effect enhancement
    const productCards = document.querySelectorAll(".products-grid > div");
    productCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -15,
          scale: 1.03,
          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
          duration: 0.5,
          ease: "power2.inOut",
        });
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
      observerRefs.current.forEach((el) => {
        observer.unobserve(el);
      });
      window.removeEventListener("scroll", handleScroll);

      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.removeEventListener("click", () => {});
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
          <div className="hero-content" ref={heroContentRef}>
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

        <BenefitsSection />

        <AboutSection />

        <Testimonials />

        <section id="contact" className="contact-section">
          <div className="section-decorator circle-pattern"></div>
          <div className="section-decorator wave"></div>
          <div className="container">
            <h2 className="animate fade-in-up">Get In Touch</h2>
            <p className="animate fade-in-up delay-1">
              Have questions about our products or sustainability practices?
              We'd love to hear from you!
            </p>
            <div className="contact-content">
              <div className="contact-form animate fade-in-left">
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="contact-info animate fade-in-right">
                <div className="info-item">
                  <div className="info-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>
                      123 Green Lane, Eco Park
                      <br />
                      Bangalore, Karnataka 560001
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <p>+91 98765 43210</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4>Email Us</h4>
                    <p>hello@eco-verse.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
