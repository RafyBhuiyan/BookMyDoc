import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/navbar";
import axios from "axios";

export default function Contact() {
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
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar
        scrollToHome={scrollToHome}
        scrollToHowItWorks={scrollToHowItWorks}
      />

      {/* Contact Form */}
      <div className="max-w-xl mx-auto py-20 px-4">
        <div className="p-8 rounded-xl bg-white shadow-lg border border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-8 text-black">
            Contact Us
          </h2>

          <Formik
            initialValues={{ name: "", email: "", message: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              try {
                const response = await axios.post(
                  "http://localhost:8000/contact",
                  values,
                  {
                    headers: {
                      "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    },
                    withCredentials: true, // ensures cookies (session) are sent
                  }
                );

                if (response.data.success) {
                  alert("✅ Message sent! We will get back to you soon.");
                  actions.resetForm();
                } else {
                  alert("❌ Something went wrong. Please try again.");
                }
              } catch (error) {
                console.error(error);

                if (error.response && error.response.data.errors) {
                  // Laravel validation errors
                  const messages = Object.values(error.response.data.errors)
                    .flat()
                    .join("\n");
                  alert(`❌ Validation Error:\n${messages}`);
                } else {
                  alert("❌ Something went wrong. Please try again later.");
                }
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <Field
                    name="name"
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 border rounded-md bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full px-4 py-2 border rounded-md bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-1 font-medium">Message</label>
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Enter your message"
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-md bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                      errors.message && touched.message
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                  {errors.message && touched.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
