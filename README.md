# AI-Powered Interview Preparation Platform

An AI-powered full-stack application that helps candidates prepare for job interviews by analyzing their resumes against job descriptions, identifying skill gaps, and generating personalized interview preparation reports.

The platform uses Google's Gemini API to evaluate candidate profiles and generate structured technical questions, behavioral questions, and personalized preparation roadmaps.

## Overview

Preparing for interviews requires understanding job requirements, identifying skill gaps, and practicing relevant questions. This platform brings these activities together into one application.

Users can upload their resumes, provide a self-description and target job description, and receive an AI-generated interview preparation report tailored to their profile.

## Key Features

- **AI-Powered Resume Analysis:** Extracts and analyzes resume content from uploaded PDF documents.
- **Job Description Matching:** Compares candidate skills and experience against job requirements.
- **Match Score:** Generates a numerical score representing the candidate's alignment with the target role.
- **Skill Gap Identification:** Highlights missing skills and categorizes them by severity.
- **Technical Interview Questions:** Generates role-relevant technical questions with explanations of interviewer intent and suggested answers.
- **Behavioral Interview Questions:** Provides behavioral questions with guidance on how to approach answers.
- **Personalized Preparation Roadmap:** Generates a structured seven-day interview preparation plan.
- **Interview Report Management:** Saves reports and allows users to access previously generated reports.
- **ATS-Friendly Resume Generation:** Uses AI-generated HTML and Puppeteer to generate tailored resume PDFs.
- **Authentication:** Supports user registration, login, logout, and protected application routes.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, SCSS |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Integration | Google Gemini API |
| API Communication | REST APIs, Axios |
| Authentication | JWT, HTTP-only Cookies |
| PDF Processing | pdf-parse |
| PDF Generation | Puppeteer |
| State Management | React Context API, Custom Hooks |
| Version Control | Git, GitHub |

## System Architecture

```text
                 User
                  |
                  v
          React.js Frontend
                  |
             Axios / REST
                  |
                  v
          Node.js + Express
                  |
          +-------+--------+
          |       |        |
          v       v        v
       MongoDB  Gemini   Puppeteer
               API       PDF
          |       |
          +-------+
                  |
                  v
          Interview Report
                  |
                  v
          React Dashboard
```

## Application Workflow

1. The user registers or logs into the application.
2. The user uploads a resume in PDF format.
3. The user provides a self-description and target job description.
4. The backend extracts text from the uploaded resume.
5. The extracted resume content and job description are passed to the Gemini API.
6. Gemini generates a structured interview preparation report.
7. The application stores the generated report in MongoDB.
8. The frontend displays the match score, skill gaps, technical questions, behavioral questions, and preparation roadmap.
9. Users can revisit saved reports and generate an ATS-friendly resume PDF.

## Backend API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/logout` | Log out and clear the authentication cookie |
| GET | `/api/auth/get-me` | Retrieve current authenticated user |

### Interview Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interview/` | Generate an interview preparation report |
| GET | `/api/interview/` | Retrieve all reports belonging to the logged-in user |
| GET | `/api/interview/report/:interviewId` | Retrieve a specific interview report |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Generate a tailored resume PDF |

Protected endpoints require authentication.

## Project Structure

```text
Interview-Ai/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── blacklist.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── interview/
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB instance or MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/gunavardhan-one3/Interview-Ai.git
cd Interview-Ai
```

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the Backend directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Configure the frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:3000
```

For local development, configure the frontend API clients to use the local backend URL. For production, use the deployment configuration and API proxy.

## Security and File Handling

- Password-based user authentication.
- JWT-based protected routes.
- HTTP-only authentication cookies.
- User-specific interview report retrieval.
- PDF resume uploads with a 3 MB file-size limit.

## Future Improvements

- Add automated frontend and backend testing.
- Introduce more advanced resume parsing and skill extraction.
- Add interview simulation with real-time feedback.
- Implement analytics to track preparation progress.
- Introduce additional AI models and evaluation strategies.
- Improve deployment automation and monitoring.

## Author

**Guna Vardhan Dodla**

GitHub: [gunavardhan-one3](https://github.com/gunavardhan-one3)

