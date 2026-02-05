import React from 'react';
import Hero from '../components/Hero';
import ImageShowcase from '../components/ImageShowcase';
import HowItWorks from '../components/HowItWorks';
import FeaturedStations from '../components/FeaturedStations';

const Landing = () => {
  return (
    <div className="landing-page">
      <Hero />
      <ImageShowcase />
      <HowItWorks />
    </div>
  );
};

export default Landing;