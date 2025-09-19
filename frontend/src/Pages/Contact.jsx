import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/navbar";

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
    subject: Yup.string().required("Subject is required"),
    userType: Yup.string().required("Please select a user type"),
    message: Yup.string().min(10, "Message must be at least 10 characters"),
  });

  const scrollToHome = () => {
    navigate("/", { state: { scrollTo: "home" } });
  };
  const scrollToHowItWorks = () => {
    navigate("/", { state: { scrollTo: "how-it-works" } });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar scrollToHome={scrollToHome} scrollToHowItWorks={scrollToHowItWorks} />

      {/* Hero Section */}
      <section className="bg-blue-50 pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="p-5 mb-6 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Better Data
            </span>{" "}
            Scalable AI.
          </h1>
          <p className="text-gray-700">
            Have questions about BookMyDoc? We're here to help you connect with the right healthcare professionals.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl text-center hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
            <p className="text-blue-600 font-bold">+8800000000000</p>
            <p className="text-gray-500 text-sm mt-1">Anytime</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl text-center hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">Email Support</h3>
            <p className="text-blue-600 font-bold">support@bookmydoc.com</p>
            <p className="text-gray-500 text-sm mt-1">Response within 24 hours</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl text-center hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">Office Address</h3>
            <p className="text-blue-600 font-bold">BookmyDoc Ave</p>
            <p className="text-gray-500 text-sm mt-1">Dhaka, Bangladesh</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl text-center hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
            <p className="text-blue-600 font-bold">Monday – Friday</p>
            <p className="text-gray-500 text-sm mt-1">9 AM – 6 PM BDT</p>
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="flex-grow pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-xl p-6 hover:bg-gray-200 transition">
            <h2 className="text-center p-3 text-3xl mb-4">Send Us a Message</h2>
            <p className="text-gray-600 mb-6 p-4">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <Formik
              initialValues={{
                name: "",
                email: "",
                subject: "",
                userType: "",
                message: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                try {
                  const response = await fetch("http://127.0.0.1:8000/api/message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: values.name,
                      email: values.email,
                      user_type: values.userType,
                      subject: values.subject,
                      message: values.message,
                    }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    actions.resetForm();
                    alert("✅ Message sent! We will get back to you soon.");
                  } else {
                    alert("❌ " + (data.message || "Failed to send message."));
                  }
                } catch (error) {
                  alert("❌ Network error. Please try again.");
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-5">
                  {/** Name Field */}
                  <div>
                    <label className="block mb-1 font-medium">Full Name</label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.name && touched.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/** Email Field */}
                  <div>
                    <label className="block mb-1 font-medium">Email Address</label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="..@....com"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.email && touched.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/** Subject Field */}
                  <div>
                    <label className="block mb-1 font-medium">Subject</label>
                    <Field
                      id="subject"
                      name="subject"
                      placeholder="What's the issue about?"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.subject && touched.subject ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.subject && touched.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/** User Type Field */}
                  <div>
                    <label className="block mb-1 font-medium">Select User Type</label>
                    <Field
                      as="select"
                      id="userType"
                      name="userType"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black focus:ring-2 focus:ring-indigo-500 ${
                        errors.userType && touched.userType ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">--Select--</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="other">Other</option>
                    </Field>
                    {errors.userType && touched.userType && (
                      <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
                    )}
                  </div>

                  {/** Message Field */}
                  <div>
                    <label className="block mb-1 font-medium">Message</label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.message && touched.message ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.message && touched.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/** Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                      Send Message
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/** FAQ Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">Frequently Asked Questions</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Find quick answers to common questions about BookMyDoc.
            </p>
            <div className="space-y-3">
              {/** FAQ items */}
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  How do I book an appointment with a doctor?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  Navigate to the booking page, select a doctor, choose a time slot, and confirm.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  Are all doctors on BookMyDoc verified?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  Yes. We verify all doctors' credentials before allowing them to accept patients.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  How secure is my medical information?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  We use encryption and comply with privacy regulations to protect your data.
                </p>
              </details>
              {/** Add more FAQ items as needed */}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="bg-red-50 py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Medical Emergency?</h3>
          <p className="text-red-800 mb-4">
            If you're experiencing a medical emergency, please call 999 or visit your nearest emergency room immediately.
          </p>
          <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
            Call 999
          </button>
        </div>
      </section>
    </div>
  );
}
