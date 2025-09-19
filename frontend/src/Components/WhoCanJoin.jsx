import React from "react";
import { Box, Container, VStack, Text, SimpleGrid, Card, CardBody, HStack, Icon, List, ListItem, ListIcon, Button } from "@chakra-ui/react";
import { FaUserInjured, FaUserMd, FaCheckCircle } from "react-icons/fa";

const WhoCanJoin = () => {
  return (
    <Box py={20} bgGradient="linear(to-r, gray.600, gray.700)">
      <Container maxW="1100px">
        {/* Heading */}
        <VStack spacing={3} mb={12} textAlign="center">
          <Text
            fontSize="4xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, teal.300, blue.400)"
            bgClip="text"
          >
            Who Can Join BookMyDoc?
          </Text>
          <Text fontSize="lg" color="gray.200" maxW="700px">
            Our platform serves both healthcare providers and patients, creating a seamless healthcare ecosystem.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          <Card bg="gray.700" boxShadow="xl" borderRadius="2xl" overflow="hidden" _hover={{ transform: "translateY(-6px)", transition: "0.3s" }}>
            <Box bgGradient="linear(to-r, teal.400, blue.500)" p={6}>
              <HStack spacing={3}>
                <Box bg="whiteAlpha.300" p={2} borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={FaUserInjured} boxSize={6} color="white" />
                </Box>
                <Text fontSize="2xl" fontWeight="bold" color="white">For Patients</Text>
              </HStack>
            </Box>
            <CardBody>
              <Text mb={4} color="gray.100">
                Find and connect with verified healthcare professionals in your area.
              </Text>
              <List spacing={3}>
                {["Browse verified doctors by specialty","Book appointments online 24/7","Secure messaging with healthcare providers","AI-powered doctor recommendations"].map((item,index)=>(
                  <ListItem key={index} color="gray.100">
                    <ListIcon as={FaCheckCircle} color="teal.300" />{item}
                  </ListItem>
                ))}
              </List>
              <Button bgGradient="linear(to-r, teal.400, blue.500)" color="white" mt={6} size="lg" _hover={{ bgGradient: "linear(to-r, teal.500, blue.600)" }}>
                Join as Patient
              </Button>
            </CardBody>
          </Card>

          <Card bg="gray.700" boxShadow="xl" borderRadius="2xl" overflow="hidden" _hover={{ transform: "translateY(-6px)", transition: "0.3s" }}>
            <Box bgGradient="linear(to-r, purple.400, pink.500)" p={6}>
              <HStack spacing={3}>
                <Box bg="whiteAlpha.300" p={2} borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={FaUserMd} boxSize={6} color="white" />
                </Box>
                <Text fontSize="2xl" fontWeight="bold" color="white">For Doctors</Text>
              </HStack>
            </Box>
            <CardBody>
              <Text mb={4} color="gray.100">
                Expand your practice and connect with patients who need your expertise.
              </Text>
              <List spacing={3}>
                {["Manage patient appointments seamlessly","Digital prescription management","Secure patient communication","Verified profile to build trust"].map((item,index)=>(
                  <ListItem key={index} color="gray.100">
                    <ListIcon as={FaCheckCircle} color="purple.300" />{item}
                  </ListItem>
                ))}
              </List>
              <Button bgGradient="linear(to-r, purple.400, pink.500)" color="white" mt={6} size="lg" _hover={{ bgGradient: "linear(to-r, purple.500, pink.600)" }}>
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
