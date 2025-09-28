import React from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Icon,
  Image,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import heroImage from "../assets/doctor.jpg";

const HeroSection = () => {
  return (
    <Box
      bgGradient="linear(to-r, #0b1220, #101a2b)"
      color="#e6e8ee"
      pt={28} // extra padding for navbar space
      pb={20}
    >
      <Container maxW="1100px">
        <Flex direction={{ base: "column", md: "row" }} align="center">
          {/* Left Content */}
          <Box flex="1" mb={{ base: 10, md: 0 }}>
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Connecting You to Trusted Healthcare
            </Text>
            <Text fontSize="lg" mb={8} color="#a9b1c6">
              Book appointments with verified local doctors, chat securely, and
              get AI-powered recommendations.
            </Text>

            <HStack spacing={4} mb={10}>
              <Button
                size="lg"
                rounded="full"
                bg="#3b82f6"
                color="#0b1220"
                _hover={{ bg: "#3270d1" }}
              >
                Join as Patient
              </Button>
              <Button
                variant="outline"
                size="lg"
                rounded="full"
                borderColor="rgba(255,255,255,0.1)"
                color="#e6e8ee"
                _hover={{ bg: "rgba(255,255,255,0.05)" }}
              >
                Join as Doctor
              </Button>
            </HStack>

            <HStack spacing={8}>
              <VStack align="start">
                <Text fontWeight="bold">10,000+ Patients</Text>
              </VStack>
              <VStack align="start">
                <Text fontWeight="bold">500+ Verified Doctors</Text>
              </VStack>
              <VStack align="start">
                <HStack>
                  <Icon as={FaStar} color="yellow.300" />
                  <Text fontWeight="bold">4.9 Rating</Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Right Image */}
          <Box flex="1" display={{ base: "none", lg: "block" }}>
            <Image
              src={heroImage}
              alt="Doctor illustration"
              maxH="500px"
              w="400px"
              mx="auto"
              borderRadius="2xl"
              objectFit="cover"
              border="1px solid rgba(255,255,255,0.1)"
              boxShadow="0 8px 24px rgba(0,0,0,0.5)"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
