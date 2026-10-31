import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Heart, Shield, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import HairstyleCard from './HairstyleCard';

const FACE_SHAPES = [
  { id: 'Oval', name: 'Oval', desc: 'Slightly narrower jaw than temples, gently rounded curves.' },
  { id: 'Round', name: 'Round', desc: 'Equal width & length with soft curves and fuller cheeks.' },
  { id: 'Heart', name: 'Heart', desc: 'Prominent cheekbones with a narrower chin and wider forehead.' },
  { id: 'Square', name: 'Square', desc: 'Strong, defined angular jawline and broad forehead.' }
];

const LIFESTYLES = [
  { id: 'Corporate', name: 'Corporate & Executive', desc: 'Sleek, polished, board-room ready silhouettes.' },
  { id: 'Active', name: 'Fitness & Active', desc: 'High gym durability, easy high buns, sweat-friendly.' },
  { id: 'Vacation', name: 'Vacation & Glamour', desc: 'Bouncy boho curls, effortless beach & dinner aesthetic.' },
  { id: 'Low', name: 'Ultra Low Maintenance', desc: 'Minimal morning routine, long-lasting protective wear.' }
];

export default function AiStylistConsultation({ onSelectHairstyle }) {
  const [faceShape, setFaceShape] = useState('Oval');
  const [hairLength, setHairLength] = useState('Medium');
  const [lifestyle, setLifestyle] = useState('Corporate');
  const [scalpSensitivity, setScalpSensitivity] = useState('Sensitive');
  const [maintenancePreference, setMaintenancePreference] = useState('Low');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { error } = useToast();

  const handleGenerateRecommendation = async () => {
    try {
      setLoading(true);
      const res = await api.getAiRecommendations({
        faceShape,
        hairLength,
        lifestyle,
        scalpSensitivity,
        maintenancePreference
      });

      if (res.success) {
        setResults(res);
      }
    } catch (err) {
      error(err.message || 'Error generating AI consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-lavender/40">
      {!results ? (
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4FF3F] text-[#333333] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Beauty Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#333333]">
              Find Your Flawless Hairstyle Match
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Tell us about your facial structure, lifestyle, and scalp needs. Our AI algorithm crafts tailored protective style recommendations.
            </p>
          </div>

          <div className="space-y-8 max-w-3xl mx-auto">
            {/* 1. Face Shape */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                1. Select Your Face Shape
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FACE_SHAPES.map((shape) => (
                  <div
                    key={shape.id}
                    onClick={() => setFaceShape(shape.id)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center ${
                      faceShape === shape.id
                        ? 'border-[#CBB3E8] bg-[#CBB3E8]/15 ring-2 ring-[#CBB3E8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-heading font-bold text-sm text-[#333333] block mb-1">
                      {shape.name}
                    </span>
                    <span className="text-[11px] text-gray-500 leading-tight block">
                      {shape.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Lifestyle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                2. Your Primary Lifestyle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LIFESTYLES.map((life) => (
                  <div
                    key={life.id}
                    onClick={() => setLifestyle(life.id)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      lifestyle === life.id
                        ? 'border-[#D4FF3F] bg-[#D4FF3F]/20 ring-2 ring-[#D4FF3F]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-heading font-bold text-sm text-[#333333] block mb-1">
                      {life.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {life.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Scalp Sensitivity & Maintenance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Scalp Sensitivity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sensitive (Tension-Free)', 'Normal'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setScalpSensitivity(opt.startsWith('Sensitive') ? 'Sensitive' : 'Normal')}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        scalpSensitivity === (opt.startsWith('Sensitive') ? 'Sensitive' : 'Normal')
                          ? 'border-[#CBB3E8] bg-[#CBB3E8]/20 font-bold text-dark-text'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Daily Maintenance Commitment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Low (Wake & Go)', 'Medium (Love Styling)'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setMaintenancePreference(opt.startsWith('Low') ? 'Low' : 'Medium')}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        maintenancePreference === (opt.startsWith('Low') ? 'Low' : 'Medium')
                          ? 'border-[#CBB3E8] bg-[#CBB3E8]/20 font-bold text-dark-text'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={handleGenerateRecommendation}
                disabled={loading}
                className="py-4 px-10 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-base shadow-glow-tomato transition-all flex items-center justify-center gap-2 mx-auto hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>{loading ? 'Analyzing Hair Profile...' : 'Generate My Perfect Styles'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                AI Consultation Results
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[#333333]">
                Your Tailored Hairstyle Recommendations
              </h3>
            </div>
            <button
              onClick={() => setResults(null)}
              className="py-2 px-4 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Modify Consultation</span>
            </button>
          </div>

          {/* AI Stylist Note */}
          <div className="bg-[#CBB3E8]/20 rounded-2xl p-5 mb-8 border border-[#CBB3E8]/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#CBB3E8] text-[#333333] flex items-center justify-center shrink-0 font-heading font-bold text-lg">
              N
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#333333] mb-1">
                Stylist Consultation Note from Nkathaa
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {results.analysis?.aiConsultationNotes}
              </p>
            </div>
          </div>

          {/* Recommended Hairstyle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.recommendations?.map((item, idx) => (
              <div key={item.hairstyle._id} className="flex flex-col h-full relative">
                {/* Match percentage badge */}
                <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-[#D4FF3F] text-[#333333] text-xs font-extrabold shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#333333]" />
                  <span>{item.score}% Match</span>
                </div>

                <HairstyleCard
                  hairstyle={item.hairstyle}
                  onQuickBook={() => {
                    if (onSelectHairstyle) {
                      onSelectHairstyle(item.hairstyle);
                    } else {
                      window.location.href = `/book?hairstyleId=${item.hairstyle._id}`;
                    }
                  }}
                />

                {/* Match Reason callout */}
                <div className="mt-3 bg-gray-50 rounded-2xl p-3.5 border border-gray-100 text-xs">
                  <span className="font-bold text-dark-text block mb-1">Why it suits you:</span>
                  <ul className="space-y-1 text-gray-600 text-[11px]">
                    {item.matchReasons?.map((r, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
