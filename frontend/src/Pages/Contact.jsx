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
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be a Gmail address")
      .required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    userType: Yup.string().required("Please select a user type"),
    message: Yup.string().min(10, "Message must be at least 10 characters"),
  });

  const scrollToHome = () => navigate("/", { state: { scrollTo: "home" } });
  const scrollToHowItWorks = () =>
    navigate("/", { state: { scrollTo: "how-it-works" } });

  return (
    <div className="min-h-screen text-[#e6e8ee] bg-gradient-to-r from-[#0b1220] to-[#101a2b] flex flex-col">
      <Navbar
        scrollToHome={scrollToHome}
        scrollToHowItWorks={scrollToHowItWorks}
      />

      {/* Hero / Intro */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="p-5 mb-4 text-3xl font-extrabold md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#14b8a6]">
              Get in Touch
            </span>{" "}
            with BookMyDoc
          </h1>
          <p className="text-[#a9b1c6]">
            Have questions about BookMyDoc? We’re here to help you connect with
            the right healthcare professionals.
          </p>
        </div>

        {/* Quick Contact cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {[
            { title: "Phone Support", main: "+8800000000000", sub: "Anytime" },
            {
              title: "Email Support",
              main: "support@bookmydoc.com",
              sub: "Response within 24 hours",
            },
            { title: "Office Address", main: "BookmyDoc Ave", sub: "Dhaka, Bangladesh" },
            { title: "Office Hours", main: "Monday – Friday", sub: "9 AM – 6 PM BDT" },
          ].map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-xl text-center transition
                         bg-[rgba(16,26,43,0.7)] border border-white/10 backdrop-blur-md
                         hover:bg-[rgba(16,26,43,0.85)]"
            >
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-[#3b82f6] font-bold">{c.main}</p>
              <p className="text-[#a9b1c6] text-sm mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="flex-grow pt-6 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          {/* Contact Form */}
          <div
            className="rounded-2xl shadow-xl p-6 transition
                       bg-[rgba(16,26,43,0.75)] border border-white/10 backdrop-blur-md
                       hover:bg-[rgba(16,26,43,0.9)]"
          >
            <h2 className="text-center p-3 text-3xl mb-2">Send Us a Message</h2>
            <p className="text-[#a9b1c6] mb-6 p-4">
              Fill out the form below and we’ll get back to you as soon as possible.
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
    // Prepare the message data to be sent to the API
    const response = await fetch("/api/message", {
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

    const data = await response.json(); // Parse the response JSON

    if (response.ok) {
      // If message was successfully sent
      actions.resetForm(); // Reset the form
      alert("✅ Message sent! We will get back to you soon.");
    } else {
      // Handle the error if the response is not OK
      setError(data.message || "Failed to send message.");
    }
  } catch (error) {
    // Catch any network or server errors
    setError("❌ Network error. Please try again.");
  }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block mb-1 font-medium">Full Name</label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2 rounded-md
                        bg-[#0e1726] text-[#e6e8ee] placeholder-[#a9b1c6]
                        border ${errors.name && touched.name ? "border-red-500" : "border-[#1f2b44]"}
                        focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-1 font-medium">Email Address</label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="yourname@gmail.com"
                      className={`w-full px-4 py-2 rounded-md
                        bg-[#0e1726] text-[#e6e8ee] placeholder-[#a9b1c6]
                        border ${errors.email && touched.email ? "border-red-500" : "border-[#1f2b44]"}
                        focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block mb-1 font-medium">Subject</label>
                    <Field
                      id="subject"
                      name="subject"
                      placeholder="What's the issue about?"
                      className={`w-full px-4 py-2 rounded-md
                        bg-[#0e1726] text-[#e6e8ee] placeholder-[#a9b1c6]
                        border ${errors.subject && touched.subject ? "border-red-500" : "border-[#1f2b44]"}
                        focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30`}
                    />
                    {errors.subject && touched.subject && (
                      <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* User Type */}
                  <div>
                    <label className="block mb-1 font-medium">Select User Type</label>
                    <Field
                      as="select"
                      id="userType"
                      name="userType"
                      className={`w-full px-4 py-2 rounded-md
                        bg-[#0e1726] text-[#e6e8ee]
                        border ${errors.userType && touched.userType ? "border-red-500" : "border-[#1f2b44]"}
                        focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30`}
                    >
                      <option value="">--Select--</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="other">Other</option>
                    </Field>
                    {errors.userType && touched.userType && (
                      <p className="text-red-400 text-sm mt-1">{errors.userType}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block mb-1 font-medium">Message</label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-2 rounded-md
                        bg-[#0e1726] text-[#e6e8ee] placeholder-[#a9b1c6]
                        border ${errors.message && touched.message ? "border-red-500" : "border-[#1f2b44]"}
                        focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30`}
                    />
                    {errors.message && touched.message && (
                      <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2 rounded-full
                                 bg-[#3b82f6] text-[#0b1220] font-medium
                                 hover:bg-[#3270d1] transition"
                    >
                      Send Message
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* FAQ */}
          <div
            className="rounded-2xl shadow-xl p-6
                       bg-[rgba(16,26,43,0.7)] border border-white/10 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-[#a9b1c6] mb-6">
              Find quick answers to common questions about BookMyDoc.
            </p>

            <div className="space-y-3">
              {[
                {
                  q: "How do I book an appointment with a doctor?",
                  a: "Go to the booking page, select a doctor, choose a time slot, and confirm.",
                },
                {
                  q: "Are all doctors on BookMyDoc verified?",
                  a: "Yes. We verify all doctors' credentials before allowing them to accept patients.",
                },
                {
                  q: "How secure is my medical information?",
                  a: "We use encryption and comply with privacy regulations to protect your data.",
                },
              ].map((item, idx) => (
                <details key={idx} className="border border-white/10 rounded-md overflow-hidden">
                  <summary className="cursor-pointer px-4 py-3 font-medium text-[#e6e8ee] bg-[rgba(14,23,38,0.9)]">
                    {item.q}
                  </summary>
                  <p className="px-4 py-3 text-[#a9b1c6] bg-[rgba(14,23,38,0.6)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency strip */}
      <section className="py-8">
        <div
          className="max-w-4xl mx-auto text-center px-4 rounded-2xl border border-red-500/20
                     bg-[rgba(127,29,29,0.15)] backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-red-300 mb-2">Medical Emergency?</h3>
          <p className="text-red-200 mb-4">
            If you're experiencing a medical emergency, please call 999 or visit your nearest emergency room immediately.
          </p>
          <button className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition">
            Call 999
          </button>
        </div>
      </section>
    </div>
  );
}
