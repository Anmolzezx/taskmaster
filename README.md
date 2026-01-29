# TaskMaster - Project Management Application

## 📱 Overview

TaskMaster is a full-stack project management application built with **Node.js/Express** backend and **Android (Jetpack Compose)** frontend. It provides comprehensive project and task management capabilities with a modern, Material 3 UI.

## ✨ Features

### Backend (Node.js/Express)
- ✅ **User Authentication**: JWT-based auth with access & refresh tokens
- ✅ **User Profile Management**: Update profile, change password
- ✅ **Password Reset**: Secure token-based password reset flow
- ✅ **Project Management**: CRUD operations for projects
- ✅ **Task Management**: Full task lifecycle with status & priority
- ✅ **File Uploads**: Multer-based file attachment system (10MB limit)
- ✅ **API Documentation**: Swagger/OpenAPI 3.0 at `/api-docs`
- ✅ **Testing**: Jest & Supertest with 70%+ coverage
- ✅ **Database**: PostgreSQL with Sequelize ORM

### Android (Jetpack Compose)
- ✅ **Authentication UI**: Login & Register with real-time validation
- ✅ **Project Management**: Create, view, delete projects
- ✅ **Task Management**: Create tasks with status/priority, update status, delete
- ✅ **Material 3 Design**: Modern, consistent UI with dynamic theming
- ✅ **Offline Storage**: DataStore for secure token persistence
- ✅ **Clean Architecture**: MVVM, Repository pattern, Hilt DI
- ✅ **Type-Safe Navigation**: Jetpack Compose Navigation with arguments

## 🏗️ Architecture

### Backend
```
backend/
├── src/
│   ├── config/         # Database, Swagger config
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth, upload, error handling
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   └── app.js          # Express app setup
├── tests/
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
└── docs/               # Documentation
```

### Android
```
android/
├── app/                # Main app module
│   └── ui/             # Compose screens & ViewModels
├── core/
│   ├── common/         # Shared utilities
│   ├── data/           # Repositories, local storage
│   └── network/        # Retrofit, API interfaces
```

## 🚀 Quick Start

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmaster
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

3. **Run Database Migrations**
```bash
npm run migrate
```

4. **Start Server**
```bash
npm run dev
```

Server runs at `http://localhost:5000`
API docs at `http://localhost:5000/api-docs`

### Android Setup

1. **Open in Android Studio**
```bash
cd android
```

2. **Configure Base URL**
Update `core/common/src/main/java/com/taskmaster/core/common/Constants.kt`:
```kotlin
const val BASE_URL = "http://10.0.2.2:5000/api/"  // Emulator
// const val BASE_URL = "http://YOUR_IP:5000/api/"  // Physical device
```

3. **Build & Run**
- Click "Run" in Android Studio
- Or use: `./gradlew installDebug`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-token` - Verify reset token
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks?projectId=:id` - List tasks (filtered by project)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Attachments
- `POST /api/attachments` - Upload file
- `GET /api/attachments/:id` - Get attachment info
- `GET /api/attachments/:id/download` - Download file
- `DELETE /api/attachments/:id` - Delete attachment

## 🧪 Testing

### Backend Tests
```bash
cd backend

npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage # Coverage report
```

**Current Coverage**: 70%+ (25+ test cases)

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiry**: Access (15m), Refresh (7d)
- **Input Validation**: Joi schemas for all inputs
- **File Upload Limits**: 10MB max, type filtering
- **CORS**: Configurable origins
- **SQL Injection Protection**: Sequelize ORM

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: jsonwebtoken, bcryptjs
- **Validation**: Joi
- **File Upload**: Multer
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI

### Android
- **Language**: Kotlin
- **UI**: Jetpack Compose (Material 3)
- **DI**: Hilt
- **Navigation**: Navigation Compose
- **Network**: Retrofit, OkHttp
- **Serialization**: kotlinx.serialization
- **Storage**: DataStore
- **Async**: Coroutines, Flow

## 📦 Deployment

See [DEPLOYMENT.md](backend/DEPLOYMENT.md) for detailed deployment instructions including:
- Local setup
- Production deployment (Render, Heroku, Railway)
- Environment variables
- Health checks
- Troubleshooting

## 🎯 Development Progress

**Total Commits**: 39/72 (54% complete)

- ✅ Days 1-3: Backend (User management, file uploads, testing)
- ✅ Days 4-5: Android Auth (UI, API integration)
- ✅ Days 6-7: Project & Task Management
- 🚧 Day 8: Polish & Testing
- 📋 Day 9: Final features & documentation

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Contact

For questions or support, please open an issue on GitHub.
