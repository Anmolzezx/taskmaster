# TaskMaster - Full Stack Project & Task Management App

A comprehensive project and task management application with a **Node.js backend** and **Android app** built with modern technologies and clean architecture principles.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)
![Android](https://img.shields.io/badge/android-Kotlin%20%2B%20Jetpack%20Compose-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎯 Project Overview

**TaskMaster** is a full-stack task management solution designed to showcase enterprise-level development practices, clean architecture, and modern tech stacks. Perfect for demonstrating skills to potential employers.

### **Key Features**
- 🔐 **User Authentication** - JWT-based secure authentication
- 📊 **Project Management** - Create and manage multiple projects
- ✅ **Task Management** - Full CRUD operations with Kanban board
- 👥 **Team Collaboration** - Assign tasks, add comments
- 📎 **File Attachments** - Upload and manage task attachments
- 📱 **Offline-First** - Android app works offline with sync
- 🎨 **Modern UI** - Material 3 design with dark mode

---

## 🏗️ Architecture

### **Backend** (`/backend`)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (Access + Refresh tokens)
- **Security**: Helmet, CORS, bcrypt
- **Validation**: Joi

### **Android** (`/android`)
- **Language**: Kotlin
- **UI**: Jetpack Compose + Material 3
- **Architecture**: Clean Architecture + MVVM
- **DI**: Hilt
- **Async**: Coroutines + Flow
- **Networking**: Retrofit + OkHttp
- **Local DB**: Room
- **Security**: EncryptedSharedPreferences

---

## 📁 Project Structure

```
taskmaster/
├── backend/              # Node.js REST API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── README.md
│
├── android/              # Android Application (Coming Soon)
│   ├── app/
│   ├── core/
│   ├── feature/
│   └── README.md
│
├── docs/                 # Documentation & Screenshots
└── README.md            # This file
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- PostgreSQL (v14+)
- Android Studio (for Android app)
- Git

### **Backend Setup**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

Backend will run at `http://localhost:5000`

### **Android Setup** (Coming Soon)
Instructions will be added when Android app is ready.

---

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend API documentation
- [Architecture Guide](./docs/architecture.md) - System architecture details
- [API Documentation](./docs/api.md) - API endpoints reference

---

## 🛠️ Tech Stack Highlights

### **Backend**
✅ RESTful API design  
✅ JWT authentication with refresh tokens  
✅ PostgreSQL with Sequelize ORM  
✅ Input validation and error handling  
✅ Security best practices (Helmet, CORS)  
✅ Environment-based configuration  

### **Android** (In Progress)
✅ Multi-module Clean Architecture  
✅ MVVM pattern with ViewModels  
✅ Jetpack Compose for modern UI  
✅ Offline-first with Room database  
✅ Dependency Injection with Hilt  
✅ Reactive programming with Kotlin Flow  

---

## 📈 Development Progress

- [x] Backend project initialization
- [x] Express server setup
- [ ] Database configuration
- [ ] Authentication system
- [ ] Projects API
- [ ] Tasks API
- [ ] Android app initialization
- [ ] Android authentication
- [ ] Kanban board UI
- [ ] Offline sync

---

## 🎯 Why This Project?

This project demonstrates:
- **Full-stack development** skills
- **Clean architecture** principles
- **Modern tech stack** proficiency
- **Security best practices**
- **Scalable design** patterns
- **Production-ready** code quality

Perfect for showcasing to recruiters at companies like Google, Amazon, Microsoft, and other top tech companies.

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 👨‍💻 Author

Built as a portfolio project to demonstrate modern full-stack development skills.

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

---

**⭐ Star this repo if you find it helpful!**
