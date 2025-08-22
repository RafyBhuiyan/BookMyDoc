import React, { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/navbar";
import HeroSection from "../Components/HeroSection";
import HowItWorks from "../Components/HowItWorks";
import WhoCanJoin from "../Components/WhoCanJoin";
import WhyChoose from "../Components/WhyChoose";

const Homepage = () => {
  const location = useLocation();

  const homeRef = useRef(null); // HeroSection top
  const howItWorksRef = useRef(null);

  const scrollToHome = () => {
    if (homeRef.current) homeRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) howItWorksRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (location.state?.scrollTo === "home") {
      scrollToHome();
    }
    if (location.state?.scrollTo === "how-it-works") {
      scrollToHowItWorks();
    }
  }, [location.state]);

  return (
    <Box bg="white" minH="100vh">
   
      <Navbar scrollToHome={scrollToHome} scrollToHowItWorks={scrollToHowItWorks} />

      <div ref={homeRef}>
        <HeroSection />
      </div>
      <div ref={howItWorksRef}>
        <HowItWorks />
      </div>
      <WhoCanJoin />
      <WhyChoose />
    </Box>
  );
};

export default Homepage;
