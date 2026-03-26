import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CtaBanner from './components/CtaBanner';
import BlogPreviewSection from './components/BlogPreviewSection';
import WhyUsSection from './components/WhyUsSection';

export const metadata: Metadata = {
  title: 'HomePro Solutions – Professional Home Maintenance Services',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhyUsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <CtaBanner />
    </>
  );
}
