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
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaUserMd, FaUser } from "react-icons/fa";
import logo from "../assets/logo_white.png"; // Adjust the path as necessary
const Navbar = ({ scrollToHome, scrollToHowItWorks }) => {
  const navigate = useNavigate();

  // Check if doctorToken or patientToken is present
  const doctorToken = localStorage.getItem("doctorToken");
  const patientToken = localStorage.getItem("patientToken");

    // Determine the correct dashboard URL
  let dashboardLink = null;
  if (doctorToken) {
    dashboardLink = "/doctor"; // Doctor's Dashboard
  } else if (patientToken) {
    dashboardLink = "/user"; // Patient's Dashboard
  }

  const handleLogout = () => {
    localStorage.clear(); // Clear the token from localStorage
    navigate("/"); // Redirect to the home page
  };

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
<Box as={Link} to="/" display="flex" alignItems="center">
  <img 
    src={logo} 
    alt="BookMyDoc1" 
    style={{ height: "50px", objectFit: "contain" }} 
  />
</Box>
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

          {/* Conditional Render for Login/Logout */}
          <HStack spacing={4}>
            {doctorToken || patientToken ? (
              <>
                {/* Dashboard Button - Only show if the user is logged in */}
                {dashboardLink && (
                  <Button
                    as={Link}
                    to={dashboardLink} // Navigate to the correct dashboard
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
                    Dashboard
                  </Button>
                )}
                {/* Logout Button */}
                <Button
                  onClick={handleLogout} // Trigger logout
                  colorScheme="red"
                  size="md"
                  rounded="full"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="700"
                  px={6}
                  leftIcon={<Icon as={FaUser} />}
                  bg="white"
                  color="blue.600"
                  _hover={{
                    bg: "white",
                    transform: "scale(1.05)",
                  }}
                  boxShadow="md"
                >
                  Logout
                </Button>
              </>
            ) : (
              // If not logged in, show login buttons for doctor and patient
              <>
                <Button
                  as={Link}
                  to="/doctor/login"
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
                  to="/user/login"
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
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
