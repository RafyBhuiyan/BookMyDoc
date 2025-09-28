import React from "react";
import { Box, Container, VStack, Text, SimpleGrid, Card, Icon } from "@chakra-ui/react";
import { FaCalendarCheck, FaComments, FaStar } from "react-icons/fa";

const features = [
  { title: "Easy Booking", description: "Book appointments 24/7 with real-time availability and instant confirmation", icon: FaCalendarCheck },
  { title: "Secure Messaging", description: "HIPAA-compliant secure messaging for all your medical communications", icon: FaComments },
  { title: "Smart Recommendations", description: "AI-powered doctor recommendations based on your symptoms and preferences", icon: FaStar },
];

const WhyChoose = () => {
  return (
    <Box py={20} bg="#0b1220" color="#e6e8ee">
      <Container maxW="1100px">
        <VStack spacing={2} mb={12} textAlign="center">
          <Text fontSize="3xl" fontWeight="bold">Why Choose BookMyDoc?</Text>
          <Text fontSize="lg" color="#a9b1c6">
            Experience healthcare that puts you first with our comprehensive platform features.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="outline"
              textAlign="center"
              p={6}
              bg="#101a2b"
              color="#e6e8ee"
              boxShadow="lg"
              border="1px solid"
              borderColor="#1f2b44"
              _hover={{ bg: "#0e1726" }}
            >
              <VStack spacing={4}>
                <Icon as={feature.icon} boxSize={10} color="#14b8a6" />
                <Text fontSize="xl" fontWeight="bold">{feature.title}</Text>
                <Text color="#a9b1c6">{feature.description}</Text>
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default WhyChoose;
