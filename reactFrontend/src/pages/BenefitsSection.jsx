import React from "react";
import "./BenefitsSection.css";

const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="section-decorator wave"></div>
      <div className="container">
        <h2 className="animate fade-in-up">Why Choose Eco-Friendly?</h2>

        <div className="benefits-grid">
          <div className="benefit-card animate fade-in-up">
            <div className="benefit-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3>Healthier Living</h3>
            <p>
              Products free from harmful chemicals and toxins for your
              wellbeing.
            </p>
          </div>
          <div className="benefit-card animate fade-in-right">
            <div className="benefit-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3>Support Sustainability</h3>
            <p>
              Each purchase contributes to a more sustainable future for our
              planet.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Reduce Waste</h3>
            <p>
              Our products are designed to minimize waste and environmental
              impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
