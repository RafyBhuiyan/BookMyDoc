import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Divider,
  Avatar,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiUser,
  FiUsers,
  FiFileText,
  FiLogOut,
  FiShield,
  FiCalendar,
} from "react-icons/fi";
import AppointmentPage from "./appoinment";
import PatientPage from "./Patient";
import PrescriptionPage from "./prescription";
const DoctorDashboard = () => {
  const sidebarBg = useColorModeValue("white", "gray.50");
  const sidebarBorderColor = useColorModeValue("gray.200", "gray.200");
  const textColor = "gray.800";
  const activeBg = useColorModeValue("blue.50", "blue.50");
  const activeColor = "blue.600";

  const menuItems = [
    { id: "profile", label: "My Profile", icon: FiUser },
    { id: "patients", label: "My Patients", icon: FiUsers },
    { id: "appointments", label: "Appointments", icon: FiCalendar },
    { id: "prescriptions", label: "Prescriptions", icon: FiFileText },
  ];

  const [activePage, setActivePage] = useState("profile");

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6} color="gray.800">
              Dashboard Overview
            </Text>
            {/* Cards */}
            <Flex mb={8} gap={6} wrap="wrap">
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                flex="1"
                minW="250px"
                border="1px"
                borderColor="gray.100"
              >
                <Text fontWeight="bold" color="gray.800" mb={2}>
                  Today's Appointments
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  12
                </Text>
              </Box>

              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                flex="1"
                minW="250px"
                border="1px"
                borderColor="gray.100"
              >
                <Text fontWeight="bold" color="gray.800" mb={2}>
                  Total Patients
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  247
                </Text>
              </Box>

              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                flex="1"
                minW="250px"
                border="1px"
                borderColor="gray.100"
              >
                <Text fontWeight="bold" color="gray.800" mb={2}>
                  Prescriptions
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  156
                </Text>
              </Box>
            </Flex>
          </Box>
        );
      case "patients":
        return <PatientPage />;
      case "appointments":
        return <AppointmentPage />;
      case "prescriptions":
        return <PrescriptionPage />;
      default:
        return <Text>Page not found</Text>;
    }
  };

  return (
    <Flex height="100vh" bg="white">
      {/* Sidebar */}
      <Box
        w="280px"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={sidebarBorderColor}
        display="flex"
        flexDirection="column"
        boxShadow="sm"
      >
        {/* Logo */}
        <Box p={6}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            BookMyDoc
          </Text>
        </Box>

        <Divider />

        {/* Doctor Info */}
        <Box p={6}>
          <Flex align="center">
            <Avatar
              name="Dr. Sarah Johnson"
              size="md"
              bg="blue.500"
              color="white"
              mr={4}
            />
            <Box>
              <Text fontWeight="bold" fontSize="lg" color={textColor}>
                Dr. Sarah Johnson
              </Text>
              <Text fontSize="sm" color="gray.600">
                Cardiologist
              </Text>
            </Box>
          </Flex>
        </Box>

        <Divider />

        {/* Navigation Menu */}
        <VStack spacing={1} align="stretch" p={4} flex={1}>
          {menuItems.map((item) => (
            <Flex
              key={item.id}
              align="center"
              p={3}
              borderRadius="md"
              bg={activePage === item.id ? activeBg : "transparent"}
              color={activePage === item.id ? activeColor : textColor}
              _hover={{
                bg: "gray.100",
                cursor: "pointer",
              }}
              onClick={() => setActivePage(item.id)}
            >
              <Icon as={item.icon} mr={3} />
              <Text fontWeight="medium">{item.label}</Text>
            </Flex>
          ))}
        </VStack>

        {/* Sign Out & Footer */}
        <Box p={4}>
          <Flex
            align="center"
            p={3}
            borderRadius="md"
            color={textColor}
            _hover={{
              bg: "gray.100",
              cursor: "pointer",
            }}
            mb={6}
          >
            <Icon as={FiLogOut} mr={3} />
            <Text fontWeight="medium">Sign Out</Text>
          </Flex>

          <Divider mb={4} />

          <VStack spacing={2} align="start">
            <Flex align="center" color="green.600">
              <Icon as={FiShield} mr={2} />
              <Text fontSize="sm" fontWeight="medium">
                HIPAA Compliant Platform
              </Text>
            </Flex>
            <Text fontSize="xs" color="gray.500">
              v2.1.0
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={8} overflowY="auto" bg="white">
        {renderContent()}
      </Box>
    </Flex>
  );
};

export default DoctorDashboard;