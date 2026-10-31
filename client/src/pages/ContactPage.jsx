import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from '../components/Icons';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { success } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      success('Thank you! Your message has been sent to Nkathaa.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#CBB3E8] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] tracking-tight">
            We’d Love to Hear From You
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Have questions about an appointment, hair extensions, or customized bridal styling? Reach out via WhatsApp or submit a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Direct Callout */}
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                  Fastest Response
                </span>
                <h3 className="font-heading font-bold text-base text-dark-text mb-1">
                  Chat Directly on WhatsApp
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Send pictures of your hair or preferred style for instant consultation.
                </p>
                <a
                  href="https://wa.me/254712345678?text=Hello%20Nkathaa,%20I%20have%20an%20inquiry%20regarding%20braiding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Open WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Contact Details List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-lavender/40 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#CBB3E8]/30 text-dark-text flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Phone & WhatsApp</span>
                  <a href="tel:+254712345678" className="text-sm font-semibold text-dark-text hover:underline">
                    +254 712 345 678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4FF3F]/40 text-dark-text flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Email Address</span>
                  <a href="mailto:hello@nkathaa.com" className="text-sm font-semibold text-dark-text hover:underline">
                    hello@nkathaa.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#E34234]/15 text-[#E34234] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Studio Address</span>
                  <p className="text-sm font-semibold text-dark-text">
                    Argwings Kodhek Road, Kilimani, Nairobi, Kenya
                  </p>
                  <span className="text-[11px] text-gray-500">Free secure client parking available</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-gray-100 text-dark-text flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Business Hours</span>
                  <p className="text-xs text-dark-text font-medium">Monday – Saturday: 8:00 AM – 7:00 PM</p>
                  <p className="text-xs text-dark-text font-medium">Sunday: 10:00 AM – 5:00 PM (VIP By Appt)</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 flex items-center justify-around">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-pink-600 transition-colors"
              >
                <InstagramIcon className="w-5 h-5 text-pink-500" />
                <span>Instagram</span>
              </a>
              <span className="text-gray-200">|</span>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black transition-colors"
              >
                <TikTokIcon className="w-4 h-4 text-black" />
                <span>TikTok</span>
              </a>
              <span className="text-gray-200">|</span>
              <a
                href="https://wa.me/254712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Form & Studio Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-lavender/40">
              <h3 className="font-heading font-bold text-xl text-dark-text mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Fill in your details and we’ll reply within a few hours.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-heading font-bold text-base text-dark-text mb-1">
                    Message Received!
                  </h4>
                  <p className="text-xs text-gray-600 mb-4">
                    Thank you for reaching out. Nkathaa will get back to you shortly via WhatsApp or email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="py-2 px-4 rounded-full bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Joy Ndinda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. joy@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +254 712 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      How can we help you? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the hairstyle you have in mind or any questions about your appointment..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-sm shadow-glow-tomato transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Styled Location Map Preview */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-sm text-dark-text flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E34234]" />
                  <span>Studio Location Map</span>
                </span>
                <span className="text-xs text-gray-500">Kilimani, Nairobi</span>
              </div>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                {/* Embedded styled interactive OpenStreetMap */}
                <iframe
                  title="Braiding with Nkathaa Studio Location"
                  className="w-full h-full border-0"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=36.7800%2C-1.3000%2C36.8100%2C-1.2800&layer=mapnik&marker=-1.2921%2C36.7905"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
