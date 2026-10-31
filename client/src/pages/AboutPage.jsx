import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShieldCheck, Scissors, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#CBB3E8] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Our Brand Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] tracking-tight">
            Passion for Natural Hair. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5BA8] to-[#E34234]">
              Respect for Every Crown.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed">
            Braiding with Nkathaa was founded on a simple principle: beauty should never come at the cost of pain or damaged hairlines.
          </p>
        </div>

        {/* The Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-gray-100 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop"
                alt="Nkathaa styling natural hair"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-lavender/50 max-w-xs hidden sm:block">
              <span className="text-xs font-bold text-[#333333] block mb-1">
                "Your scalp is living skin."
              </span>
              <p className="text-[11px] text-gray-500">
                Tension-free braiding preserves follicular integrity and allows peaceful sleep on day one.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C5BA8]">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#333333]">
              From Kitchen Braids to Nairobi's Most Beloved Studio
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Growing up, Nkathaa experienced what countless women go through: long, agonizing braiding appointments, bleeding hairlines, and sleepless nights holding pain relievers. She believed there had to be a better way to honor African braiding heritage.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              After years of studying scalp trichology, tension mechanics, and precision geometric parting, she founded <strong>Braiding with Nkathaa</strong>. Today, our private Kilimani studio offers a sanctuary where women relax, recharge, and leave with neat, long-lasting crowns without a trace of discomfort.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="border-l-2 border-[#CBB3E8] pl-4">
                <span className="font-heading font-bold text-xl text-dark-text block">Zero-Pain</span>
                <span className="text-xs text-gray-500">Tension-Free Technique</span>
              </div>
              <div className="border-l-2 border-[#D4FF3F] pl-4">
                <span className="font-heading font-bold text-xl text-dark-text block">100% Virgin</span>
                <span className="text-xs text-gray-500">Human Hair Curls Used</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Core Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-soft border border-lavender/40 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#D4FF3F] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
              Our Compass
            </span>
            <h3 className="text-2xl sm:text-4xl font-heading font-bold text-[#333333]">
              Our Mission & Values
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#CBB3E8] text-dark-text flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-dark-text mb-2">
                Scalp Health First
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Traction alopecia is preventable. We never sacrifice your natural edges or follicle density for temporary style longevity.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#D4FF3F] text-dark-text flex items-center justify-center mb-4">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-dark-text mb-2">
                Geometric Precision
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clean, crisp, symmetrical parting and uniform plait thickness. Our craftsmanship looks immaculate from every angle.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#E34234] flex items-center justify-center mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-dark-text mb-2">
                Punctual & Respectful
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                We value your time. When you book a slot, we are ready on time. No double bookings, no 3-hour waiting room delays.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#CBB3E8]/30 via-white to-[#D4FF3F]/30 p-8 sm:p-12 rounded-3xl border border-lavender/50 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#333333] mb-3">
            Experience the Difference Yourself
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Book an appointment today and discover how comfortable and luxurious braiding can truly be.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-sm shadow-glow-tomato transition-all"
          >
            <span>Book Your Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
