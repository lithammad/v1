import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { Footer } from '../components/CTA.jsx';

export default function MarketingLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
