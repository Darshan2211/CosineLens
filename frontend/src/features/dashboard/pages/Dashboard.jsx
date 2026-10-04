import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import useSearchPipeline from "../hooks/useSearchPipeline";
import Architecture from "../components/Architecture/Architecture";
import Redis from "../components/Technology/Redis";
import Stack from "../components/Technology/Stack";
import Footer from "../components/Footer/Footer";
import RrfArchitecture from "../components/Architecture/RrfArchitecture";

const Dashboard = () => {
  const searchPipeline = useSearchPipeline();
  return (
    <>
      <Navbar />
      <Hero searchPipeline={searchPipeline} />
      <HowItWorks
        coldTime={searchPipeline.coldTime}
        cacheHitTime={searchPipeline.cacheHitTime}
      />
      <Architecture />
      <RrfArchitecture />
      <Redis />
      <Stack />
      <Footer />
    </>
  );
};

export default Dashboard;
