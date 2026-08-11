import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header
      className="nav"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-inner">
        <a href="#" className="logo">
          <span className="logo-mark">AV</span>
          Aegis
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#stats">Stats</a>
        </nav>
        <div className="nav-actions">
          <a href="http://localhost:8080/login" className="btn btn-ghost">Sign In</a>
          <a href="http://localhost:8080/register" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </motion.header>
  );
}
