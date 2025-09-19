import React from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
} from "@chakra-ui/react";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaComments } from "react-icons/fa";

const steps = [
  {
    title: "Sign Up",
    description: "Create your account as a patient or doctor with verified credentials",
    icon: FaUserMd,
    color: "#3b82f6",
  },
  {
    title: "Find Doctors",
    description: "Browse verified local doctors by specialty, availability, and ratings",
    icon: FaUserInjured,
    color: "#14b8a6",
  },
  {
    title: "Book Appointment",
    description: "Schedule appointments that fit your schedule with instant confirmation",
    icon: FaCalendarCheck,
    color: "#a855f7",
  },
  {
    title: "Get Care",
    description: "Meet your doctor and get prescriptions, advice, and follow-up care",
    icon: FaComments,
    color: "#ec4899",
  },
];

const HowItWorks = () => {
  return (
    <Box py={20} bg="rgba(15,23,42,0.85)" backdropFilter="blur(6px)">
      <Container maxW="1100px">
        <VStack spacing={3} mb={12} textAlign="center">
          <Text
            fontSize="4xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, #3b82f6, #14b8a6)"
            bgClip="text"
          >
            How BookMyDoc Works
          </Text>
          <Text fontSize="lg" color="#a9b1c6" maxW="700px">
            Getting quality healthcare has never been easier. Follow these simple steps to connect with the right doctor.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {steps.map((step, index) => (
            <Card
              key={index}
              bg="rgba(16,26,43,0.7)"
              backdropFilter="blur(8px)"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="2xl"
              _hover={{ transform: "translateY(-6px)", bg: "rgba(16,26,43,0.85)" }}
            >
              <CardBody textAlign="center" p={6}>
                <Box
                  bgGradient={`linear(to-r, ${step.color}, ${step.color}80)`}
                  p={4}
                  borderRadius="full"
                  boxShadow="md"
                  mb={4}
                >
                  <Icon as={step.icon} boxSize={8} color="white" />
                </Box>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient={`linear(to-r, ${step.color}, ${step.color}80)`}
                  bgClip="text"
                  mb={2}
                >
                  {step.title}
                </Text>
                <Text fontSize="md" color="#a9b1c6">{step.description}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
