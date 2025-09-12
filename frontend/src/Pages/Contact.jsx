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
    userType: Yup.string().required("Please select a user type"),
    message: Yup.string().min(10, "Message must be at least 10 characters"),
  });

  // Scroll helpers to navigate back to sections on the home page
  const scrollToHome = () => {
    navigate("/", { state: { scrollTo: "home" } });
  };
  const scrollToHowItWorks = () => {
    navigate("/", { state: { scrollTo: "how-it-works" } });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <Navbar
        scrollToHome={scrollToHome}
        scrollToHowItWorks={scrollToHowItWorks}
      />
      <section className="bg-blue-50 pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 class="p-5 mb-6 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
            <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Better Data
            </span>{" "}
            Scalable AI.
          </h1>
          <p className="text-gray-700">
            Have questions about BookMyDoc? We're here to help you connect with
            the right healthcare professionals.
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
            <p className="text-gray-500 text-sm mt-1">
              Response within 24 hours
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl text-center hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">Office Address</h3>
            <p className="text-blue-600 font-bold">BookmyDoc Ave</p>
            <p className="text-gray-500 text-sm mt-1">Dhaka, Bangladesh</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl text-center hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
            <p className="text-blue-600 font-bold">Monday – Friday</p>
            <p className="text-gray-500 text-sm mt-1">9 AM – 6 PM BDT</p>
          </div>
        </div>
      </section>

      <section className="flex-grow pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <div className="bg-gray-100 border-3 border-gray-200 rounded-lg shadow-xl p-6 hover:bg-gray-200 transition">
            <h2 className="text-center p-3 text-3xl mb-4">Send Us a Message</h2>
            <p className="text-gray-600 mb-6 p-4">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
            <Formik
              initialValues={{ name: "", email: "", userType: "", message: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/api/message",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        user_type: values.userType,
                        subject: values.subject,
                        message: values.message,
                      }),
                    }
                  );

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
                  <div>
                    <label className="block mb-1 font-medium">
                      Full Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Email Address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="..@....com"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Subject
                    </label>
                    <Field
                      id="subject"
                      name="subject"
                      type="subject"
                      placeholder="What's the issue about?"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 ${
                        errors.subject && touched.subject
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.subject && touched.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className="block mb-1 font-medium"
                    >
                      Select User Type
                    </label>
                    <Field
                      as="select"
                      id="userType"
                      name="userType"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500  ${
                        errors.userType && touched.userType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">--Select--</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="other">Other</option>
                    </Field>
                    {errors.userType && touched.userType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.userType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Message
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500  ${
                        errors.message && touched.message
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.message && touched.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

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

          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">Frequently Asked Questions</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Find quick answers to common questions about BookMyDoc.
            </p>
            <div className="space-y-3">
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  How do I book an appointment with a doctor?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  Simply navigate to our booking page, select your preferred
                  doctor, choose an available time slot and confirm your
                  appointment. You'll receive a confirmation email shortly
                  afterwards.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  Are all doctors on BookMyDoc verified?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  Yes. We conduct rigorous credential checks and ensure that
                  every physician listed on our platform is properly licensed
                  and vetted before they can accept patients.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  How secure is my medical information?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  We employ industry‑standard encryption and comply with
                  healthcare privacy regulations to ensure your data is
                  protected. Your information will never be shared without your
                  consent.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  What if I need to cancel or reschedule my appointment?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  You can cancel or reschedule your appointment through your
                  account dashboard. Please do so at least 24 hours prior to
                  your appointment time to avoid cancellation fees.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  How does the AI recommendation system work?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  Our recommendation engine analyzes your health concerns and
                  preferences to suggest suitable doctors based on specialty,
                  availability, and patient reviews.
                </p>
              </details>
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  Is there a fee to use BookMyDoc?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  Creating an account and browsing doctors is free. You only pay
                  for the appointment fee as set by the doctor.
                </p>
              </details>
              {/* FAQ Item 7 */}
              <details className="border rounded-md">
                <summary className="cursor-pointer px-4 py-3 font-medium text-blue-700 bg-blue-50">
                  How can I access my medical records?
                </summary>
                <p className="px-4 py-3 text-gray-700">
                  You can access your electronic medical records through your
                  secure user dashboard once your healthcare provider uploads
                  them to the system.
                </p>
              </details>
            </div>

            {/* Still have questions */}
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
              <h3 className="font-semibold text-lg">Still Have Questions?</h3>
              <p className="text-gray-600 mt-2 mb-4">
                Our support team is available by phone or live chat.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                  Call Support
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical emergency notice */}
      <section className="bg-red-50 py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Medical Emergency?
          </h3>
          <p className="text-red-800 mb-4">
            If you're experiencing a medical emergency, please call 911 or visit
            your nearest emergency room immediately. BookMyDoc is not intended
            for emergency medical situations.
          </p>
          <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
            Call 911
          </button>
        </div>
      </section>
    </div>
  );
}
