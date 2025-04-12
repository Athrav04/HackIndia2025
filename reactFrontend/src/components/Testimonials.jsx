import React from "react";
import "./Testimonials.css";

const Testimonials = () => {
  
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="testimonials-badge">TESTIMONIALS</span>
          <h2>What Our Customers Say</h2>
          <div className="testimonials-divider"></div>
          <p>
            Discover how our eco-friendly products have made a positive impact
            on our customers' lives.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="testimonial-content">
              <div className="quote-icon">❝</div>
              <p>
                "I've switched all my kitchen essentials to eco-friendly
                alternatives and couldn't be happier. The quality is exceptional
                and I feel good about reducing my environmental footprint."
              </p>
            </div>
            <div className="testimonial-author">
              <img
                src="https://randomuser.me/api/portraits/women/58.jpg"
                alt="Customer"
              />
              <div>
                <h4>Priya Sharma</h4>
                <p>Happy Customer</p>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-content">
              <div className="quote-icon">❝</div>
              <p>
                "The eco-friendly kitchen set has transformed how I cook.
                Everything is so durable and I feel good about reducing plastic
                waste."
              </p>
            </div>
            <div className="testimonial-author">
              <img
                src="https://randomuser.me/api/portraits/men/43.jpg"
                alt="Customer"
              />
              <div>
                <h4>Rajiv Patel</h4>
                <p>Home Chef</p>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-content">
              <div className="quote-icon">❝</div>
              <p>
                "The plant-based cleaning supplies are gentle yet effective. My
                home smells amazing without harsh chemicals!"
              </p>
            </div>
            <div className="testimonial-author">
              <img
                src="https://randomuser.me/api/portraits/women/33.jpg"
                alt="Customer"
              />
              <div>
                <h4>Ananya Desai</h4>
                <p>Conscious Consumer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
