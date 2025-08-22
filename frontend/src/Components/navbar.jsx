import React from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Button,
  HStack,
  Spacer,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHeart, FaUserMd, FaUser } from "react-icons/fa";

const Navbar = ({ scrollToHome, scrollToHowItWorks }) => {
  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="1000"
      py={3}
      boxShadow="sm"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "md" }}
    >
      <Container maxW="1140px" px={6}>
        <Flex alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <HStack spacing={2}>
            <Box
              bg="blue.100"
              p={2}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FaHeart color="#3182CE" size="18px" />
            </Box>
            <Text
              fontSize="24px"
              fontWeight="extrabold"
              color="blue.600"
              fontFamily="Poppins, sans-serif"
              letterSpacing="tight"
            >
              <Link to="/">BookMyDoc</Link>
            </Text>
          </HStack>

          <Spacer />

          {/* Navigation Links */}
          <HStack
            spacing={10}
            mx={8}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            <ChakraLink
              onClick={scrollToHome}
              cursor="pointer"
              fontWeight="500"
              color="gray.700"
              _hover={{ color: "blue.500", textDecoration: "none" }}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
            >
              Home
            </ChakraLink>

            <ChakraLink
              onClick={scrollToHowItWorks}
              cursor="pointer"
              fontWeight="500"
              color="gray.700"
              _hover={{ color: "blue.500", textDecoration: "none" }}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
            >
              How it Works
            </ChakraLink>

            <ChakraLink
              as={Link}
              to="/contact"
              fontWeight="500"
              color="gray.700"
              _hover={{ color: "blue.500", textDecoration: "none" }}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
            >
              Contact
            </ChakraLink>
          </HStack>

          <Spacer />

          {/* Register Buttons with Icons */}
          <HStack spacing={4}>
            <Button
              as={Link}
              to="/Dashboard"
              colorScheme="blue"
              size="md"
              rounded="full"
              fontFamily="Poppins, sans-serif"
              fontWeight="700"
              px={6}
              leftIcon={<Icon as={FaUserMd} />}
              bg="white" 
              color="blue.600" 
              _hover={{
                bg: "white", 
                transform: "scale(1.05)", 
              }}
              boxShadow="md" 
            >
              Doctor
            </Button>
            <Button
              as={Link}
              to="/Patient/Dashboard"
              colorScheme="blue"
              size="md"
              rounded="full"
              fontFamily="Poppins, sans-serif"
              fontWeight="700"
              px={6}
              leftIcon={<Icon as={FaUser} />}
              bg="blue.500" 
              color="white" 
              _hover={{
                bg: "blue.600", 
                transform: "scale(1.05)", 
              }}
              boxShadow="md" 
            >
              Patient
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
