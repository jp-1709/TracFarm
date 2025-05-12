# 🌾 TracFarm

A modern full-stack platform for agricultural traceability, quality assurance, and transparent supply chain management.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Framework-brightgreen)
![React](https://img.shields.io/badge/React-Frontend-blue)
![JWT](https://img.shields.io/badge/JWT-Security-red)
![AI](https://img.shields.io/badge/AI-Gemini-purple)

---

## Overview

TracFarm is designed to improve trust, transparency, and accountability across the agricultural value chain. It connects farmers, distributors, retailers, and customers through a digital system that enables product tracking, secure authentication, and AI-assisted quality evaluation.

The platform provides a reliable foundation for managing agricultural products from farm to consumer while improving decision-making and operational visibility.

---

## Key Features

- Role-based dashboards for farmers, distributors, retailers, customers, and administrators
- Farm and product registration workflows
- End-to-end product traceability across the supply chain
- AI-powered quality analysis for agricultural products
- Secure authentication using JWT
- QR-based product verification and traceability
- Responsive and modern user interface
- Transportation and distribution tracking

---

## Technology Stack

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- RESTful APIs
- Maven

### Frontend

- React.js
- JavaScript
- Tailwind CSS
- Axios

### Database & Services

- MySQL
- Google Gemini API
- Cloudinary for image storage

---

## User Roles

### Farmer

- Register farm details
- Add agricultural products
- Upload product images
- Manage product information

### Distributor

- Manage transportation activities
- Track shipment movement between locations

### Retailer

- Manage product availability and distribution

### Customer

- View product origin and traceability
- Scan QR codes for verification

### Admin

- Monitor platform activity
- Manage system users and operations

---

## AI Quality Check

TracFarm integrates AI-based analysis to evaluate agricultural product quality from uploaded images. This helps support better quality assurance and enables faster, more informed decisions across the supply chain.

---

## System Architecture

The application follows a layered architecture that separates concerns across the user interface, business logic, persistence layer, and external AI services.

```text
User
 ↓
React Frontend
 ↓
Spring Boot Backend
 ↓
Service Layer
 ↓
Repository Layer
 ↓
MySQL Database
 ↓
AI Service (Gemini API)
```

This structure promotes scalability, maintainability, and clean separation of responsibilities.

---

## Project Structure

```text
TracFarm/
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── security/
│   └── config/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── styles/
├── public/
│   ├── images/
│   └── assets
├── package.json
├── pom.xml
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jp-1709/TracFarm.git
cd TracFarm
```

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

### 3. Run the frontend

```bash
npm install
npm start
```

---

## Application Modules

- User Authentication
- Product Management
- Farm Registration
- Transportation Tracking
- AI Quality Analysis
- Role-Based Dashboards
- Supply Chain Monitoring

---

## Security

The platform uses modern security practices including Spring Security and JWT-based authentication to protect user access and secure communication between services.

---

## Impact

TracFarm addresses critical challenges in agricultural supply chains such as:

- Limited transparency in product origin
- Difficulty tracking product movement
- Weak quality verification processes
- Low trust between farmers and consumers

---

## Author

JP's

Automation Testing | Full Stack Development | Java | Spring Boot | React
