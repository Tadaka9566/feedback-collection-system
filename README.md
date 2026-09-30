# Feedback Collection System

A full-stack web-based Feedback Collection System developed using
HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

## Features

- User Registration and Login
- Secure Password Hashing using bcrypt
- JWT Authentication
- Role-Based Access Control
- Feedback Submission
- Feedback History
- Admin Dashboard
- Search and Filter Feedback
- Feedback Status Management
- Notifications
- Feedback Analytics and Charts
- CSV Export
- PDF Report Generation
- Input Validation
- Responsive User Interface

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Security
- JWT Authentication
- bcryptjs
- Environment Variables

## Project Structure

```text
Feedback-Collection-System
│
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── index.html
│   ├── login.html
│   ├── feedback.html
│   ├── history.html
│   ├── admin.html
│   ├── notifications.html
│   ├── style.css
│   ├── login.js
│   ├── feedback.js
│   ├── history.js
│   ├── admin.js
│   ├── notifications.js
│   └── pdf.js
│
├── .env
├── .gitignore
├── package.json
└── README.md