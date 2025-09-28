import React from "react";
import {
  Box,
  Container,
  Flex,
  Button,
  HStack,
  Spacer,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaUser } from "react-icons/fa";
import logo from "../assets/logo_white.png";

const Navbar = ({ scrollToHome, scrollToHowItWorks }) => {
  const navigate = useNavigate();

  // Tokens
  const doctorToken = localStorage.getItem("doctorToken");
  const patientToken = localStorage.getItem("patientToken");

  // Dashboard link
  let dashboardLink = null;
  if (doctorToken) {
    dashboardLink = "/doctor";
  } else if (patientToken) {
    dashboardLink = "/user";
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      mt={4}
      mx="auto"
      w="95%"
      py={3}
      px={6}
      bg="rgba(15, 23, 42, 0.55)" // dark slate with opacity
      backdropFilter="blur(12px)"  // frosted blur effect
      border="1px solid"
      borderColor="rgba(255,255,255,0.1)"
      borderRadius="2xl"
      boxShadow="0 8px 24px rgba(0,0,0,0.4)"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 12px 28px rgba(0,0,0,0.55)" }}
    >
      <Container maxW="1140px">
        <Flex alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <HStack spacing={2}>
            <Box as={Link} to="/" display="flex" alignItems="center">
              <img
                src={logo}
                alt="BookMyDoc"
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
              color="#e6e8ee"
              _hover={{ color: "#3b82f6", textDecoration: "none" }}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
            >
              Home
            </ChakraLink>

            <ChakraLink
              onClick={scrollToHowItWorks}
              cursor="pointer"
              fontWeight="500"
              color="#e6e8ee"
              _hover={{ color: "#3b82f6", textDecoration: "none" }}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
            >
              How it Works
            </ChakraLink>

            <ChakraLink
              as={Link}
              to="/contact"
              fontWeight="500"
              color="#e6e8ee"
              _hover={{ color: "#3b82f6", textDecoration: "none" }}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
            >
              Contact
            </ChakraLink>
          </HStack>

          <Spacer />

          {/* Auth Buttons */}
          <HStack spacing={4}>
            {doctorToken || patientToken ? (
              <>
                {dashboardLink && (
                  <Button
                    as={Link}
                    to={dashboardLink}
                    size="md"
                    rounded="full"
                    fontFamily="Poppins, sans-serif"
                    fontWeight="700"
                    px={6}
                    leftIcon={<Icon as={FaUserMd} />}
                    bg="rgba(59,130,246,0.15)"
                    color="#e6e8ee"
                    border="1px solid rgba(255,255,255,0.1)"
                    _hover={{ bg: "rgba(59,130,246,0.25)", transform: "scale(1.03)" }}
                    boxShadow="md"
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  size="md"
                  rounded="full"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="700"
                  px={6}
                  leftIcon={<Icon as={FaUser} />}
                  bg="#3b82f6"
                  color="#0b1220"
                  _hover={{ bg: "#3270d1", transform: "scale(1.03)" }}
                  boxShadow="md"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/doctor/login"
                  size="md"
                  rounded="full"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="700"
                  px={6}
                  leftIcon={<Icon as={FaUserMd} />}
                  bg="rgba(59,130,246,0.15)"
                  color="#e6e8ee"
                  border="1px solid rgba(255,255,255,0.1)"
                  _hover={{ bg: "rgba(59,130,246,0.25)", transform: "scale(1.03)" }}
                  boxShadow="md"
                >
                  Doctor
                </Button>
                <Button
                  as={Link}
                  to="/user/login"
                  size="md"
                  rounded="full"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="700"
                  px={6}
                  leftIcon={<Icon as={FaUser} />}
                  bg="#3b82f6"
                  color="#0b1220"
                  _hover={{ bg: "#3270d1", transform: "scale(1.03)" }}
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
