import React from "react";
import "./AboutSection.css"; // Import the CSS file for styling

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="section-decorator dots"></div>
      <div className="container">
        <h2 className="animate fadeInUp">About Us</h2>
        <div className="about-content">
          <div className="about-text">
            <p className="animate fadeInRight delay-1">
              Founded in 2022, ECO-verse began with a simple mission: to make
              eco-friendly products accessible, affordable, and appealing to
              everyone. We believe that small changes in our daily habits can
              lead to significant positive impacts on our environment.
            </p>
            <p className="animate fadeInRight delay-2">
              Our team of eco-enthusiasts sources and designs products that not
              only reduce environmental impact but also bring joy and
              functionality to your everyday life.
            </p>
            <button className="about-cta animate fadeInRight delay-3">
              Learn More About Our Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
