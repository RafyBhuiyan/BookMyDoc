import React, { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import WhoCanJoin from "../components/WhoCanJoin";
import WhyChoose from "../components/WhyChoose";

const Homepage = () => {
  const location = useLocation();

  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);

  const scrollToHome = () => {
    if (homeRef.current) homeRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToHowItWorks = () => {
    if (howItWorksRef.current)
      howItWorksRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (location.state?.scrollTo === "home") {
      scrollToHome();
    }
    if (location.state?.scrollTo === "how-it-works") {
      scrollToHowItWorks();
    }
  }, [location.state]);

  // ❌ Remove this — it can cause flashes and overrides.
  // localStorage.removeItem("chakra-ui-color-mode");

  return (
    <Box
      // Give the whole page a dark gradient so the glassy navbar looks right
      bgGradient="linear(to-r, #0b1220, #101a2b)"
      color="#e6e8ee"
      minH="100vh"
      // Make sure the background shows through blur
      // (no need for overflow hidden here)
    >
      <Navbar
        scrollToHome={scrollToHome}
        scrollToHowItWorks={scrollToHowItWorks}
      />

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
