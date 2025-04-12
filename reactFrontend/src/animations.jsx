import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Function to initialize Locomotive Scroll and ScrollTrigger
export const initAnimations = () => {
  // Initialize Locomotive Scroll with performance-focused settings
  const locomotiveScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    smoothMobile: false,
    inertia: 0.3, // Reduced significantly for better performance
    lerp: 0.05, // Lower value for smoother and lighter scrolling
    multiplier: 1, // Default speed
    tablet: { smooth: true },
    smartphone: { smooth: false }, // Disable on mobile for better performance
    reloadOnContextChange: false, // Prevent unnecessary reloads
    gestureDirection: "vertical",
    touchMultiplier: 1.5,
  });

  // More efficient ScrollTrigger update approach
  // Use requestIdleCallback for non-critical updates if available
  const updateScrollTrigger = window.requestIdleCallback
    ? () => window.requestIdleCallback(() => ScrollTrigger.update())
    : () => ScrollTrigger.update();

  locomotiveScroll.on("scroll", updateScrollTrigger);

  // ScrollTrigger proxy for Locomotive Scroll - optimized
  ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
      return arguments.length
        ? locomotiveScroll.scrollTo(value, 0, 0)
        : locomotiveScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("[data-scroll-container]").style.transform
      ? "transform"
      : "fixed",
  });

  // Optimize product card animations with batch processing
  const productCards = gsap.utils.toArray(".product-card");
  // Pre-set all cards at once
  gsap.set(productCards, { opacity: 0, y: 20 });

  // Create fewer scroll triggers by batching cards
  const batchSize = 4; // Process cards in groups of 4
  for (let i = 0; i < productCards.length; i += batchSize) {
    const batch = productCards.slice(i, i + batchSize);

    ScrollTrigger.create({
      trigger: batch[0], // Use first card in batch as trigger
      start: "top bottom-=150",
      scroller: "[data-scroll-container]",
      onEnter: () => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05, // Faster stagger
          ease: "power1.out", // Lighter easing
          overwrite: true, // Prevent animation conflicts
        });
      },
      once: true,
    });
  }

  // Optimized animation for product details with improved performance
  const productDetails = document.querySelector(".product-details");
  if (productDetails) {
    // Create a single timeline for product details animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: productDetails,
        start: "top bottom-=100",
        scroller: "[data-scroll-container]",
        once: true,
      },
    });

    const productImage = productDetails.querySelector(".product-image-gallery");
    const productInfo = productDetails.querySelector(".product-info");

    if (productImage && productInfo) {
      gsap.set([productImage, productInfo], { opacity: 0, y: 20 });
      tl.to(productImage, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.out",
      }).to(
        productInfo,
        { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" },
        "-=0.2"
      );
    } else {
      gsap.set(productDetails, { opacity: 0, y: 20 });
      tl.to(productDetails, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.out",
      });
    }
  }

  // Optimize related products animation
  const relatedProducts = document.querySelectorAll(".related-product-card");
  if (relatedProducts.length) {
    // Use opacity only, avoid scale transformations for better performance
    gsap.set(relatedProducts, { opacity: 0 });

    ScrollTrigger.create({
      trigger: ".related-products-slider",
      start: "top bottom-=100",
      scroller: "[data-scroll-container]",
      onEnter: () => {
        gsap.to(relatedProducts, {
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
          overwrite: true,
        });
      },
      once: true,
    });
  }

  // Highly optimized refresh function
  const refresh = () => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      locomotiveScroll.update();
      ScrollTrigger.refresh(true); // Force refresh
    });
  };

  // Debounced window resize handler with increased threshold
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refresh, 300);
  });

  // Add markers for visibility distance to load animations earlier
  ScrollTrigger.config({
    limitCallbacks: true, // Improve performance by limiting callback frequency
  });

  // Initial updates
  locomotiveScroll.update();
  ScrollTrigger.refresh();

  return locomotiveScroll;
};

// Optimized function to update animations when content changes
export const updateAnimations = () => {
  // Create a more efficient update pattern
  const rafId = requestAnimationFrame(() => {
    ScrollTrigger.refresh(true);
  });

  // Return a method to cancel the update if needed
  return () => cancelAnimationFrame(rafId);
};

// Enhanced cleanup function to prevent memory leaks
export const cleanupAnimations = (locomotiveScroll) => {
  if (locomotiveScroll) {
    locomotiveScroll.destroy();
  }

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  ScrollTrigger.clearMatchMedia();
  gsap.killTweensOf("*"); // Kill all active animations
};
