import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 99.99, decimals: 2, suffix: '%', label: 'Uptime SLA' },
  { value: 40, decimals: 0, suffix: '+', label: 'Security controls' },
  { value: 120, decimals: 0, suffix: 'ms', label: 'Avg. access latency' },
  { value: 0, decimals: 0, suffix: '', label: 'Plaintext on server' },
];

function Counter({ value, decimals, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      className="stat"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="stat-value">
        {display.toFixed(decimals)}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="section" id="stats" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="stats-row">
          {stats.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
