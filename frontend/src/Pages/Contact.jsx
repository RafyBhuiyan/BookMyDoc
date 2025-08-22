import React from "react";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../Components/navbar";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const toast = useToast();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Email must be a Gmail address"
      )
      .required("Email is required"),
    message: Yup.string().min(10, "Message must be at least 10 characters"),
  });

  const scrollToHome = () => {
    navigate("/", { state: { scrollTo: "home" } });
  };

  const scrollToHowItWorks = () => {
    navigate("/", { state: { scrollTo: "how-it-works" } });
  };

  return (
    <Box minH="100vh" bg="white" color="black">
      {/* Navbar */}
      <Navbar scrollToHome={scrollToHome} scrollToHowItWorks={scrollToHowItWorks} />

      {/* Contact Form */}
      <Container maxW="600px" py={20}>
        <Box
          p={8}
          borderRadius="xl"
          bg="white"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.300"
        >
          <Heading
            as="h2"
            size="lg"
            textAlign="center"
            mb={8}
            color="black"
          >
            Contact Us
          </Heading>

          <Formik
            initialValues={{ name: "", email: "", message: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              console.log("Form submitted:", values);
              actions.resetForm();
              toast({
                title: "Message sent.",
                description: "We will get back to you soon!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <FormControl mb={4} isInvalid={errors.name && touched.name}>
                  <FormLabel>Name</FormLabel>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Enter your name"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.400"
                    color="black"
                    _placeholder={{ color: "gray.500" }}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={errors.email && touched.email}>
                  <FormLabel>Email</FormLabel>
                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.400"
                    color="black"
                    _placeholder={{ color: "gray.500" }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl mb={6} isInvalid={errors.message && touched.message}>
                  <FormLabel>Message</FormLabel>
                  <Field
                    as={Textarea}
                    name="message"
                    placeholder="Enter your message"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.400"
                    color="black"
                    _placeholder={{ color: "gray.500" }}
                  />
                  <FormErrorMessage>{errors.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blackAlpha"
                  size="md"
                  borderRadius="full"
                  display="block"
                  mx="auto"
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
}
