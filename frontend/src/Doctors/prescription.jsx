import { Box, Text, VStack } from "@chakra-ui/react";

const PrescriptionPage = () => {
  return (
    <Box p={12} bg="gray.50" minH="100%" w="100%">
      <VStack spacing={8} align="start">
        <Text fontSize="4xl" fontWeight="bold" color="blue.600">
          Prescriptions
        </Text>
        <Text fontSize="xl" color="gray.700">
          This is where prescriptions will be displayed.
        </Text>

        {/* Example  */}
        <VStack spacing={6} w="100%">
          {[1, 2, 3].map((presc) => (
            <Box
              key={presc}
              p={6}
              w="100%"
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              border="1px"
              borderColor="gray.200"
            >
              <Text fontSize="2xl" fontWeight="semibold" color="gray.800">
                Prescription {presc}
              </Text>
              <Text fontSize="md" color="gray.600">
                Details about prescription {presc} will appear here.
              </Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default PrescriptionPage;
