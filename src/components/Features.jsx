import { motion } from 'framer-motion';

const features = [
  {
    icon: '🔐',
    title: 'Zero-Knowledge Encryption',
    desc: 'Secrets are encrypted in the browser before transmission. The server never sees plaintext — ever.',
  },
  {
    icon: '💥',
    title: 'Burn After Reading',
    desc: 'Secrets are cryptographically shredded the moment they are decrypted by the recipient.',
  },
  {
    icon: '🛡️',
    title: 'Conditional Access',
    desc: 'Lock secrets to specific countries, IP ranges, and block VPNs or Tor automatically.',
  },
  {
    icon: '📋',
    title: 'Immutable Audit Trail',
    desc: 'Every event is cryptographically chained in an immutable, tamper-proof log.',
  },
  {
    icon: '🌍',
    title: 'IP Intelligence',
    desc: 'Each access attempt is scored with geolocation and threat-intelligence signals.',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenant White-Label',
    desc: 'Deploy under your own brand with custom domains, logos, colors, and SMTP.',
  },
];

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Platform Capabilities</span>
          <h2>Built for enterprise security teams</h2>
          <p>
            Every feature is designed to replace plaintext credential sharing
            in email, forever.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.12 }}
              whileHover={{ y: -4 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
