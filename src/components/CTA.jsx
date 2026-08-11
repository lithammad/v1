import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="section" id="security">
      <div className="container">
        <motion.div
          className="cta-banner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <h2>Ready to eliminate plaintext credentials?</h2>
          <p>
            Set up your organization in minutes. No credit card required.
          </p>
          <Link to="/register" className="btn btn-primary">Create Free Organization</Link>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© 2026 Aegis — Secure Secret Delivery Platform</span>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#stats">Stats</a>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
