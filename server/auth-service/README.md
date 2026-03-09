# Inventory Management System

A microservices-based inventory management system built with Node.js, Express.js, and MongoDB. The architecture includes an API Gateway, Auth Service, and Product Service for scalable and secure inventory operations.

## Architecture Overview

- **API Gateway**: Handles routing, authentication, and request forwarding
- **Auth Service**: Manages user authentication, authorization, and role-based access control


## Services

### Auth Service

This is the Auth Service for the Inventory Management microservices architecture.  
It is responsible for user authentication, authorization, role management, and invite-based onboarding.  
The service is designed to work behind an API Gateway and follows production-level security practices.

#### 🚀 Features

- Invite-based user onboarding (Admin / Manager / Staff)
- Secure login using JWT stored in HttpOnly cookies
- Role-Based Access Control (RBAC)
- Email invitation & password setup flow
- Centralized error handling
- MongoDB-based user persistence
- API Gateway–compatible architecture

#### 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (HttpOnly Cookies)
- **Email**: Nodemailer (SMTP)
- **Security**: bcrypt, role-based access

#### ⚙️ Setup

1️⃣ **Install dependencies**  
```bash
npm install
```

2️⃣ **Configure environment variables**  

Create a `.env` file in the root directory:

```env
PORT=4001
MONGO_URI=MonGODB URI
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

EMAIL_FROM=Inventory System <no-reply@inventory.com>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

⚠️ **Use App Passwords for Gmail or a provider like AWS SES / SendGrid in production.**

3️⃣ **Start the service**  
```bash
npm start
```

For development mode:  
```bash
npm run dev
```

The service will run on:  
http://localhost:4001

#### 🔑 Authentication Flow

1. Admin / Manager invites user
2. User receives email with Set Password link
3. User sets password and activates account
4. User logs in
5. JWT is stored in HttpOnly cookie
6. Protected APIs validate user role

#### 📡 API Routes

- `POST /auth/login` – User login
- `POST /auth/invite` – Invite user (Admin / Manager)
- `POST /auth/set-password` – Set password via invite token
- `POST /auth/logout` – Logout user

🔐 **All protected routes require authentication and role validation.**

#### 🌐 API Gateway Integration

This service is intended to be accessed via API Gateway:

- `POST /api/auth/login` → `http://localhost:4001/auth/login`

The gateway handles:  
- Routing  
- Cookie forwarding  
- Central authentication enforcement

## Getting Started

1. Clone the repository
2. Navigate to the server directory: `cd server`
3. Set up each service following their individual READMEs
4. Start the API Gateway and services

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.