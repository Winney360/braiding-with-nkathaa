import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hairstyles', path: '/hairstyles' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'AI Stylist', path: '/ai-stylist', highlight: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-soft py-3 border-b border-lavender/40'
          : 'bg-[#CBB3E8]/20 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#CBB3E8] flex items-center justify-center shadow-md border-2 border-white group-hover:scale-105 transition-transform">
              <span className="font-heading font-extrabold text-xl text-[#333333]">N</span>
            </div>
            <div>
              <span className="font-heading font-bold text-lg sm:text-xl text-[#333333] tracking-tight block">
                Braiding with Nkathaa
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block font-medium">
                Beautiful Braids • Professional Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#CBB3E8] text-[#333333] shadow-sm font-semibold'
                      : link.highlight
                      ? 'text-[#333333] hover:bg-[#D4FF3F]/40 flex items-center gap-1.5 border border-[#D4FF3F]'
                      : 'text-gray-700 hover:text-[#333333] hover:bg-[#CBB3E8]/30'
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#333333]" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/my-bookings"
              className="text-xs font-semibold text-gray-700 hover:text-[#333333] flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Lookup appointment status"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span>My Bookings</span>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-full bg-[#D4FF3F] text-[#333333] font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-[#333333]" />
                <span>Admin Hub</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1"
                title="Salon Admin Login"
              >
                Admin
              </Link>
            )}

            {/* Primary CTA (Tomato Red) */}
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-medium text-sm flex items-center gap-2 shadow-glow-tomato transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/book"
              className="px-3.5 py-1.5 rounded-full bg-[#E34234] text-white font-medium text-xs shadow-glow-tomato"
            >
              Book
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-lavender/50 px-4 pt-3 pb-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-[#CBB3E8] text-[#333333] font-semibold'
                      : link.highlight
                      ? 'bg-[#D4FF3F]/30 text-[#333333] border border-[#D4FF3F]'
                      : 'text-gray-700 hover:bg-[#CBB3E8]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.name}</span>
                    {link.highlight && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4FF3F] text-[#333333] font-bold">
                        AI Recommended
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <Link
                to="/my-bookings"
                className="px-4 py-2.5 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 flex items-center justify-between"
              >
                <span>Check My Bookings</span>
                <User className="w-4 h-4 text-gray-500" />
              </Link>

              <Link
                to="/book"
                className="w-full py-3 rounded-full bg-[#E34234] text-white text-center font-semibold text-base shadow-glow-tomato"
              >
                Book Appointment Now
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-center text-xs font-bold text-gray-700 bg-[#D4FF3F] rounded-xl"
                >
                  Go to Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="px-4 py-2 text-center text-xs text-gray-400 hover:text-gray-600"
                >
                  Admin Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
