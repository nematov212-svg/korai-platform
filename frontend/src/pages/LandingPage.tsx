import React from 'react';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { HeroSection } from '../components/landing/HeroSection.js';
import { CategoriesSection } from '../components/landing/CategoriesSection.js';
import { HowItWorksSection } from '../components/landing/HowItWorksSection.js';
import { SampleReportSection } from '../components/landing/SampleReportSection.js';
import { SafetyLimitationsSection } from '../components/landing/SafetyLimitationsSection.js';
import { PricingSection } from '../components/landing/PricingSection.js';
import { FaqSection } from '../components/landing/FaqSection.js';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col selection:bg-brand-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
        <SampleReportSection />
        <SafetyLimitationsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};
