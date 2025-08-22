import React from "react";
import { Box, Container, VStack, Text, SimpleGrid, Card, CardBody, Icon } from "@chakra-ui/react";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaComments } from "react-icons/fa";

const steps = [
  {
    title: "Sign Up",
    description: "Create your account as a patient or doctor with verified credentials",
    icon: FaUserMd,
    color: "blue.500",
  },
  {
    title: "Find Doctors",
    description: "Browse verified local doctors by specialty, availability, and ratings",
    icon: FaUserInjured,
    color: "teal.500",
  },
  {
    title: "Book Appointment",
    description: "Schedule appointments that fit your schedule with instant confirmation",
    icon: FaCalendarCheck,
    color: "purple.500",
  },
  {
    title: "Get Care",
    description: "Meet your doctor and get prescriptions, advice, and follow-up care",
    icon: FaComments,
    color: "pink.500",
  },
];

const HowItWorks = () => {
  return (
    <Box py={20} bgGradient="linear(to-r, blue.50, teal.50)">
      <Container maxW="1100px">
        {/* Heading */}
        <VStack spacing={3} mb={12} textAlign="center">
          <Text
            fontSize="4xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, blue.500, teal.400)"
            bgClip="text"
          >
            How BookMyDoc Works
          </Text>
          <Text fontSize="lg" color="gray.600" maxW="700px">
            Getting quality healthcare has never been easier. Follow these simple steps to connect with the right doctor.
          </Text>
        </VStack>

        {/* Steps Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {steps.map((step, index) => (
            <Card
              key={index}
              bg="white"
              boxShadow="lg"
              borderRadius="2xl"
              _hover={{ transform: "translateY(-6px)", transition: "0.3s" }}
            >
              <CardBody textAlign="center" p={6}>
                {/* Icon with gradient circle */}
                <Box
                  bgGradient={`linear(to-r, ${step.color}, ${step.color.replace("500", "300")})`}
                  p={4}
                  borderRadius="full"
                  boxShadow="md"
                  mb={4}
                >
                  <Icon as={step.icon} boxSize={8} color="white" />
                </Box>

                {/* Title */}
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient={`linear(to-r, ${step.color}, ${step.color.replace("500", "300")})`}
                  bgClip="text"
                  mb={2}
                >
                  {step.title}
                </Text>

                {/* Description */}
                <Text fontSize="md" color="gray.600">{step.description}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
