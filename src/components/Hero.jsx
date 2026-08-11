import { motion } from 'framer-motion';
import Scene3D from './Scene3D.jsx';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  return (
    <section className="hero">
      <div className="canvas-wrap">
        <Scene3D />
      </div>

      <div className="container hero-inner">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="badge">
            <span className="badge-dot" />
            Enterprise-Grade Zero-Knowledge Security
          </motion.div>

          <motion.h1 variants={item}>
            Share Secrets.
            <br />
            <span className="gradient-text">Not Vulnerabilities.</span>
          </motion.h1>

          <motion.p variants={item} className="hero-sub">
            Aegis is the secure secret delivery platform built for teams that
            take security seriously. Zero-knowledge encryption, burn-after-reading,
            and a full audit trail — out of the box.
          </motion.p>

          <motion.div variants={item} className="hero-cta">
            <a href="http://localhost:8080/register" className="btn btn-primary">Start Free Trial</a>
            <a href="#features" className="btn btn-ghost">View Documentation</a>
          </motion.div>

          <motion.p variants={item} className="hero-note">
            No credit card required · SOC 2 ready
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
