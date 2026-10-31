import React from 'react';
import { Sparkles } from 'lucide-react';
import AiStylistConsultation from '../components/AiStylistConsultation';

export default function AiStylistPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-gradient-to-b from-[#CBB3E8]/20 via-[#F8F8F8] to-[#F8F8F8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AiStylistConsultation />
      </div>
    </div>
  );
}
