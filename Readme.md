# Online Code Judge System

A full-stack online coding platform where users can solve programming problems, submit code, and receive automated results based on predefined test cases.

## 🚧 Project Status

Currently under development.

### Current Progress

* [x] Backend project setup
* [x] MongoDB connection
* [x] User model
* [x] Problem model
* [ ] Authentication
* [ ] Problem APIs
* [ ] Code submission system
* [ ] Code execution engine
* [ ] Test case evaluation
* [ ] Frontend
* [ ] Real-time submission status

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### Frontend

* React
* TypeScript

### Planned Infrastructure

* Redis
* BullMQ
* Docker
* WebSockets

## 📁 Project Structure

```text
Online Code Judge/
├── Backend/
│   ├── public/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🎯 Core Features

* User authentication and authorization
* Coding problem management
* Problem difficulty and tags
* Public and hidden test cases
* Code submission
* Automated code execution
* Test case evaluation
* Submission history
* Real-time submission status
* Admin problem management

## 🔐 Environment Variables

Create a `.env` file in the `Backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

> Never commit `.env` or other secrets to GitHub.

## 🚀 Getting Started

```bash
cd Backend
npm install
npm run dev
```

The backend server will run on the configured port.

## 📌 Future Improvements

As development progresses, this README will be updated with architecture details, API documentation, setup instructions, and deployment information.
