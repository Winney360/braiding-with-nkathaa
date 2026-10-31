import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Sparkles, MessageCircle, Heart } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-lavender/40 pt-16 pb-8 text-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#CBB3E8] flex items-center justify-center shadow-sm">
                <span className="font-heading font-extrabold text-xl text-[#333333]">N</span>
              </div>
              <span className="font-heading font-bold text-xl text-[#333333]">
                Braiding with Nkathaa
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6 italic leading-relaxed">
              "Beautiful Braids. Professional Care."
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              A luxury boutique studio dedicated to painless, scalp-friendly braiding, immaculate parting, and protective hair wellness in Nairobi.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/254712345678?text=Hello%20Nkathaa,%20I%20would%20like%20to%20inquire%20about%20a%20braiding%20appointment"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors"
                title="Follow on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 text-[#333333] flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Follow on TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="tel:+254712345678"
                className="w-9 h-9 rounded-full bg-[#CBB3E8]/30 text-[#333333] flex items-center justify-center hover:bg-[#CBB3E8]/60 transition-colors"
                title="Call Studio"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base text-[#333333] mb-4 tracking-wide uppercase text-xs">
              Explore Salon
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/hairstyles" className="hover:text-[#333333] hover:underline transition-all">
                  Hairstyles Catalog
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#333333] hover:underline transition-all">
                  Pinterest Gallery
                </Link>
              </li>
              <li>
                <Link to="/ai-stylist" className="hover:text-[#333333] hover:underline transition-all flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#333333]" />
                  <span>AI Hairstyle Matcher</span>
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#333333] hover:underline transition-all">
                  Client Reviews & Ratings
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#333333] hover:underline transition-all">
                  Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-[#333333] hover:underline transition-all">
                  Lookup My Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours & Studio Location */}
          <div>
            <h4 className="font-heading font-semibold text-base text-[#333333] mb-4 tracking-wide uppercase text-xs">
              Studio & Working Hours
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#CBB3E8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#333333] block">Mon - Sat:</span>
                  <span>8:00 AM – 7:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4FF3F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#333333] block">Sunday:</span>
                  <span>10:00 AM – 5:00 PM (VIP By Appt)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E34234] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#333333] block">Kilimani Studio:</span>
                  <span>Argwings Kodhek Road, Kilimani, Nairobi</span>
                </div>
              </li>
            </ul>
          </div>

          {/* VIP Club / Booking Callout */}
          <div className="bg-[#CBB3E8]/20 p-6 rounded-3xl border border-[#CBB3E8]/50">
            <span className="inline-block px-3 py-1 bg-[#D4FF3F] text-[#333333] text-[11px] font-bold rounded-full mb-3">
              VIP Loyalty Club
            </span>
            <h4 className="font-heading font-bold text-base text-[#333333] mb-2">
              Ready for Your Next Crown?
            </h4>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Appointments fill up fast for weekends. Reserve your desired style and time slot in advance.
            </p>
            <Link
              to="/book"
              className="w-full inline-block text-center py-2.5 px-4 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-medium text-xs shadow-glow-tomato transition-all"
            >
              Book Your Appointment
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Braiding with Nkathaa. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E34234] fill-[#E34234]" />
            <span>for natural hair queens</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gray-700">Salon Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gray-700">Directions</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-gray-700">Admin Area</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
