import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About ECO-verse</h3>
          <p>
            At ECO-verse, we&apos;re committed to providing sustainable, eco-friendly
            products that help reduce environmental impact without compromising
            on quality or style.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/#products">Shop</Link>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#sustainability">Sustainability</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Connect With Us</h3>
          <address>
            <p>
              Email:{" "}
              <a href="mailto:hello@eco-verse.com">hello@eco-verse.com</a>
            </p>
            <p>Phone: +91 98765 43210</p>
            <div className="social-icons">
              <a href="https://instagram.com" aria-label="Instagram">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
            </div>
          </address>
        </div>

        <div className="footer-section newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for eco-tips and exclusive offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} ECO-verse. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#shipping">Shipping Info</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
