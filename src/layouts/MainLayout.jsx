import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import AnimatedBackground from '../components/AnimatedBackground';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-zinc-100 relative font-sans">
      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Global Dynamic Background */}
      <AnimatedBackground />

      {/* Sticky Header */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 relative z-10">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
