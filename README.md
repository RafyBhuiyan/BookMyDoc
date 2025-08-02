# BookMyDOC

##  About the Project

**BookMyDOC** is an advanced healthcare appointment system designed to bridge the gap between patients and doctors through a seamless, intuitive web interface. It simplifies the process of booking consultations, accessing prescriptions from doctors, and managing health records — all from one place.

BookMyDoc serves as a centralized medical platform for both patients and doctors. The project allows patients to search for nearby doctors, make appointments based on availability and receive AI-based recommendations. Doctors can view upcoming appointments, maintain medical histories, generate digital prescriptions, and manage their schedules.

---
##  Figma Design Link

Click [BookMyDOC](https://www.figma.com/make/994TkDhNtf8183KcZZC36I/BookMyDoc-Wireframe-Platform?node-id=0-4&t=BliFBvXRgIRKrXfj-1&fbclid=IwY2xjawL6-h9leHRuA2FlbQIxMQABHjauuUO6AIT16BZLomuvnlIXBjcTMr3vPRJQNttb2YIJPnx0oVXe18_rFtvn_aem_TdoETpIytd1hPyxTjWJiRA) in Emergency

---

## 👨‍💻 Team Members

| ID           | Name                         | Email                             | Role                  |
|--------------|------------------------------|-----------------------------------|-----------------------|
| 20220204008  | Md. Asifuzzaman Shanto       | asifuzzaman2105@gmail.com         |                       |
| 20220204021  | Md. Eousuf Abdullah Shameu   | eousuf.abdullah@gmail.com         |                       |
| 20220204023  | Abdur Rafy Bhuiyan           | rafybhuiyan23@gmail.com           |                       |

---
## wakatime Badges
-- **Rafy Bhuiyan**

[![wakatime](https://wakatime.com/badge/user/fcea2923-047d-4b59-8b66-6e342e0673aa/project/ab70b96f-2698-4f2c-8ff3-d9eeb5463f88.svg)](https://wakatime.com/badge/user/fcea2923-047d-4b59-8b66-6e342e0673aa/project/ab70b96f-2698-4f2c-8ff3-d9eeb5463f88)

-- **Asifuzzaman Shanto**


-- **Eousuf Abdullah**

[![wakatime](https://wakatime.com/badge/user/ebb7cd30-f68a-4bca-bbaa-64776c6f5843/project/7b3829bf-8896-4254-aab4-3af2584c9134.svg)](https://wakatime.com/badge/user/ebb7cd30-f68a-4bca-bbaa-64776c6f5843/project/7b3829bf-8896-4254-aab4-3af2584c9134)

---

##  Core Features

- Role-based dashboards for both doctors and patients
- AI-powered doctor recommendations based on symptoms
- Medical record uploads and prescription management
- Appointment booking, rescheduling, and tracking

---
##  Technology Stack

| Layer     | Technology                        |
|-----------|------------------------------------|
| Frontend  | React (Vite) + Tailwind CSS        |
| Backend   | Laravel (PHP)                      |
| Database  | MySQL                              |

---

## UI Pages & Features

### 1. Login / Signup Page
- Secure login and signup for both roles (Doctor & Patient)
- Token-based authentication with password hashing
- Automatic redirection based on user role
- Validations to prevent duplicate accounts

### 2. Patient Dashboard
- Shows appointment history and upcoming schedules
- View AI-suggested doctors and start chats
- Quick access to medical records and prescriptions
- Easy cancellation/rescheduling options

### 3. Doctor Dashboard
- View appointment queue and pending requests
- Manage time slots and availability
- See patient history and previous interactions
- Access prescription generation tools

### 4. Appointment Booking Page
- Search and filter doctors by specialty, location, availability
- Book slots with confirmation status (pending/accepted)
- Cancel or reschedule bookings with reason input
- Shows real-time doctor availability

### 5. Medical Records Page
- Patients can upload reports, prescriptions, X-rays
- Doctors can view full medical histories
- All documents are stored securely with encryption
- Easy preview/download of records as PDFs

### 6. AI Recommendation Page
- Patients describe symptoms using text input
- AI suggests the most relevant doctors
- Based on rule-based logic or symptom mapping
- Enhances the discovery process for users

### 7. Prescription Page (Doctor Side)
- Doctors input diagnosis, medication, and instructions
- Automatically generates professional PDF prescription
- Can be downloaded or shared with patients securely
- Digital signature support (optional)

### 8. Contact & Support Page
- Contact form with name, message, and email
- Admin receives submissions via email or admin panel
- Option to categorize feedback (bug, suggestion, issue)
- Helpful FAQs for common problems

---

## Theme & Design

- Clean, minimal, and accessible layout for healthcare use
- Consistent spacing, color palette, and UI components
- Responsive design for all screen sizes
- Tailwind CSS used for rapid prototyping and layout control

---


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RafyBhuiyan/BookMyDoc.git
   cd .\BookMyDoc\
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure environment variables by copying `.env.example` to `.env` and filling in your details.
4. Run the development server:

   ```bash
   npm run dev
   ```


---

## Usage

* Sign up or log in as a user.
* Search for available doctors and book a time slot.
* View appointment history and patient details.
* Generate and download prescription PDFs.


