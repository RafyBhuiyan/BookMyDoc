import React from "react";
import { Box, Container, Flex, Text, Button, HStack, VStack, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import heroImage from "../assets/doctor.jpg";
import { Image } from "@chakra-ui/react";

const HeroSection = () => {
  return (
    <Box bgGradient="linear(to-r, blue.400, blue.600)" color="white" py={20}>
      <Container maxW="1100px">
        <Flex direction={{ base: "column", md: "row" }} align="center">
          <Box flex="1" mb={{ base: 10, md: 0 }}>
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Connecting You to Trusted Healthcare
            </Text>
            <Text fontSize="lg" mb={8} color="gray.100">
              Book appointments with verified local doctors, chat securely, and get AI-powered recommendations.
            </Text>
            <HStack spacing={4} mb={10}>
              <Button colorScheme="whiteAlpha" size="lg" bg="white" color="blue.600" _hover={{ bg: "gray.100" }}>
                Join as Patient
              </Button>
              <Button variant="outline" size="lg" borderColor="white" color="white" _hover={{ bg: "whiteAlpha.200" }}>
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
          <Box flex="1" display={{ base: "none", lg: "block" }}>
            <Image src={heroImage} alt="Doctor illustration" maxH="500px" w="400px" mx="auto" borderRadius="lg" objectFit="cover" boxShadow="lg" />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
