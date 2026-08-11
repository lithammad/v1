import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Stats from './components/Stats.jsx';
import { CTA, Footer } from './components/CTA.jsx';

export default function App() {
  return (
    <>
      <div className="grain" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
