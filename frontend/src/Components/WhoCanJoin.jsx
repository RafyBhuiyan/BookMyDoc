import React from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  HStack,
  Icon,
  List,
  ListItem,
  ListIcon,
  Button,
} from "@chakra-ui/react";
import { FaUserInjured, FaUserMd, FaCheckCircle } from "react-icons/fa";

const WhoCanJoin = () => {
  return (
    <Box py={20} bg="rgba(11,18,32,0.9)" backdropFilter="blur(6px)">
      <Container maxW="1100px">
        <VStack spacing={3} mb={12} textAlign="center">
          <Text
            fontSize="4xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, #14b8a6, #3b82f6)"
            bgClip="text"
          >
            Who Can Join BookMyDoc?
          </Text>
          <Text fontSize="lg" color="#a9b1c6" maxW="700px">
            Our platform serves both healthcare providers and patients, creating a seamless healthcare ecosystem.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          {/* Patients Card */}
          <Card
            bg="rgba(16,26,43,0.75)"
            backdropFilter="blur(8px)"
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="2xl"
            _hover={{ transform: "translateY(-6px)", bg: "rgba(16,26,43,0.9)" }}
          >
            <Box bgGradient="linear(to-r, #14b8a6, #3b82f6)" p={6}>
              <HStack spacing={3}>
                <Box
                  bg="whiteAlpha.300"
                  p={2}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaUserInjured} boxSize={6} color="white" />
                </Box>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  For Patients
                </Text>
              </HStack>
            </Box>
            <CardBody>
              <Text mb={4} color="#c9d1e6">
                Find and connect with verified healthcare professionals in your area.
              </Text>
              <List spacing={3}>
                {[
                  "Browse verified doctors by specialty",
                  "Book appointments online 24/7",
                  "Secure messaging with healthcare providers",
                  "AI-powered doctor recommendations",
                ].map((item, index) => (
                  <ListItem key={index} color="#e6e8ee">
                    <ListIcon as={FaCheckCircle} color="#14b8a6" />
                    {item}
                  </ListItem>
                ))}
              </List>
              <Button
                bgGradient="linear(to-r, #14b8a6, #3b82f6)"
                color="white"
                mt={6}
                size="lg"
                _hover={{ bgGradient: "linear(to-r, #10a197, #3270d1)" }}
              >
                Join as Patient
              </Button>
            </CardBody>
          </Card>

          {/* Doctors Card */}
          <Card
            bg="rgba(16,26,43,0.75)"
            backdropFilter="blur(8px)"
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="2xl"
            _hover={{ transform: "translateY(-6px)", bg: "rgba(16,26,43,0.9)" }}
          >
            <Box bgGradient="linear(to-r, #a855f7, #ec4899)" p={6}>
              <HStack spacing={3}>
                <Box
                  bg="whiteAlpha.300"
                  p={2}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaUserMd} boxSize={6} color="white" />
                </Box>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  For Doctors
                </Text>
              </HStack>
            </Box>
            <CardBody>
              <Text mb={4} color="#c9d1e6">
                Expand your practice and connect with patients who need your expertise.
              </Text>
              <List spacing={3}>
                {[
                  "Manage patient appointments seamlessly",
                  "Digital prescription management",
                  "Secure patient communication",
                  "Verified profile to build trust",
                ].map((item, index) => (
                  <ListItem key={index} color="#e6e8ee">
                    <ListIcon as={FaCheckCircle} color="#a855f7" />
                    {item}
                  </ListItem>
                ))}
              </List>
              <Button
                bgGradient="linear(to-r, #a855f7, #ec4899)"
                color="white"
                mt={6}
                size="lg"
                _hover={{ bgGradient: "linear(to-r, #9447dc, #cf3d87)" }}
              >
                Join as Doctor
              </Button>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default WhoCanJoin;
