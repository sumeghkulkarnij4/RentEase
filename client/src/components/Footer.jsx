import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import "../styles/components.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <Link to="/" className="nav-logo mb-4">
              <div className="logo-icon">R</div>
              <span className="logo-text text-gradient">RentEase</span>
            </Link>
            <p>
              Premium furniture rental platform. Experience luxury living without the heavy price tag. Upgrade your lifestyle today.
            </p>
            <div className="social-links">
              <a href="#" className="font-semibold text-sm">FB</a>
              <a href="#" className="font-semibold text-sm">TW</a>
              <a href="#" className="font-semibold text-sm">IG</a>
              <a href="#" className="font-semibold text-sm">LI</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <div className="footer-links">
              <Link to="/#about">About Us</Link>
              <Link to="/#careers">Careers</Link>
              <Link to="/#press">Press</Link>
              <Link to="/#sustainability">Sustainability</Link>
            </div>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <div className="footer-links">
              <Link to="/#help">Help Center</Link>
              <Link to="/#terms">Terms of Service</Link>
              <Link to="/#privacy">Privacy Policy</Link>
              <Link to="/#contact">Contact Us</Link>
            </div>
          </div>

          <div className="footer-column">
            <h3>Stay Updated</h3>
            <p className="text-muted" style={{ marginBottom: '12px' }}>
              Subscribe to our newsletter for the latest premium collections and offers.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input-premium"
              />
              <button className="btn-premium btn-primary">
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RentEase Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
