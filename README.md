# BookMyDoc

*Team Members:*  


| ID           | Name                         | Email                             | 
|--------------|------------------------------|-----------------------------------|
| 20220204008  | Md. Asifuzzaman Shanto       | asifuzzaman2105@gmail.com         |
| 20220204021  | Md. Eousuf Abdullah Shameu   | eousuf.abdullah@gmail.com         |
| 20220204023  | Abdur Rafy Bhuiyan           | rafybhuiyan23@gmail.com           |



---

## Table of Contents

1. [Project Description](#1-project-description)
2. [Workflow Overview](#2-workflow-overview)
3. [Main Features](#3-main-features)
4. [Technologies Used](#4-technologies-used)
5. [System Architecture](#5-system-architecture)
6. [Setup Guidelines](#6-setup-guidelines)
    - [Backend](#backend)
    - [Frontend](#frontend)
7. [Running the Application](#7-running-the-application)
8. [Deployment Status & Tests](#8-deployment-status--tests)
9. [Contribution Table](#9-contribution-table)
10. [Screenshots](#10-screenshots)
11. [Limitations / Known Issues](#11-limitations--known-issues)

---

## 1. Project Description

*BookMyDOC* is an advanced healthcare appointment system designed to bridge the gap between patients and doctors through a seamless, intuitive web interface. It simplifies the process of booking consultations, accessing prescriptions from doctors, and managing health records — all from one place.

BookMyDoc serves as a centralized medical platform for both patients and doctors. The project allows patients to search for nearby doctors, make appointments based on availability and receive AI-based recommendations. Doctors can view upcoming appointments, maintain medical histories, generate digital prescriptions, and manage their schedules.

---

## 2. Workflow Overview

High-level workflow of your project (can include a diagram).

1. Patients sign up / log in.  
2. They search for doctors by specialty, location, or availability.
3. Patients book, cancel, or reschedule appointments.  
4. Doctors manage their schedules, view patient history, and generate prescriptions.  
5. Patients and doctors can access medical records securely at any time.  

---

## 3. Main Features

- Role-based dashboards for both doctors and patients  
- Appointment booking, cancellation, and rescheduling  
- Prescription management with PDF export 
- Contact & support with categorized feedback  
- Clean and responsive UI design (optimized for healthcare use)  


---

## 4. Technologies Used

- **Frontend:** React (Vite), Tailwind CSS  
- **Backend:** Laravel (PHP)  
- **Database:** MySQL  
- **APIs:** RESTful APIs  
- **Other Tools:** GitHub, 
Docker, WakaTime  

---

## 5. System Architecture

**Frontend (React + Tailwind)** ↔ **Backend (Laravel API)** ↔ **Database (MySQL)**  

- Frontend communicates with backend via REST APIs.  
- Authentication is handled with tokens.  
- Backend manages data storage, and prescription generation.  
- Medical files and prescriptions are securely stored and retrieved.  


---

## 6. Setup Guidelines

### Backend


```bash
# Clone the repository
git clone https://github.com/RafyBhuiyan/BookMyDoc.git
cd backend

# Install dependencies
composer install

# Setup environment variables
cp .env.example .env
# Edit .env as needed

# Generate App Key
php artisan key:generate

# Migrate & Seed Database
php artisan migrate
php artisan db:seed


```
### Frontend

```bash
cd frontend

# Install dependencies
npm install
```

## 7. Running the Application

### Backend
```bash
cd backend

php artisan serve
```
### Frontend
```bash
cd frontend

npm run dev
```
## 8. Deployment Status & Tests

| Component | Is Deployed? | Is Dockerized? |
|-----------|--------------|----------------|
| Backend   |    No       |         Yes    |
| Frontend  |    No       |         Yes    | 



## 9. Contribution Table


| Metric                      | Total | Backend | Frontend | Member 1 | Member 2 | Member 3 |
|-----------------------------|-------|---------|----------|----------|----------|----------|
| Issues Solved               |  19   |         |          |    6     |    6     |    7     |
| WakaTime Contribution (Hours)|       |         |          | [![wakatime](https://wakatime.com/badge/user/8e47db68-1502-4309-b657-785629e3abc9/project/06b70473-2e2d-4818-8199-c7f72e45fada.svg)](https://wakatime.com/badge/user/8e47db68-1502-4309-b657-785629e3abc9/project/06b70473-2e2d-4818-8199-c7f72e45fada) | [![wakatime](https://wakatime.com/badge/user/ebb7cd30-f68a-4bca-bbaa-64776c6f5843/project/7b3829bf-8896-4254-aab4-3af2584c9134.svg)](https://wakatime.com/badge/user/ebb7cd30-f68a-4bca-bbaa-64776c6f5843/project/7b3829bf-8896-4254-aab4-3af2584c9134) | [![wakatime](https://wakatime.com/badge/user/fcea2923-047d-4b59-8b66-6e342e0673aa/project/ab70b96f-2698-4f2c-8ff3-d9eeb5463f88.svg)](https://wakatime.com/badge/user/fcea2923-047d-4b59-8b66-6e342e0673aa/project/ab70b96f-2698-4f2c-8ff3-d9eeb5463f88) |

## 10. Screenshots

<img src="frontend/src/assets/home.jpg" alt="Logo" width="200"/>

## 11. Limitations / Known Issues

- No real-time chat between patients and doctors (future scope)
- Medical reports has not been prepared properly
- Payment system not integrated
