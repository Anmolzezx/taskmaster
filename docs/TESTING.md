# TaskMaster - Testing Guide

## Backend Testing

### Setup
```bash
cd backend
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### Test Structure
```
backend/tests/
├── unit/
│   └── userController.test.js
└── integration/
    └── auth.test.js
```

### Coverage Targets
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Test Cases (25+)

#### Unit Tests (10)
- UserController.getProfile
- UserController.updateProfile
- UserController.updatePassword
- Error handling
- Validation

#### Integration Tests (15+)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/verify-reset-token
- POST /api/auth/reset-password
- Error scenarios
- Validation failures

## Android Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] Launch app → Login screen appears
- [ ] Enter invalid email → Error message
- [ ] Enter short password → Error message
- [ ] Login with wrong credentials → Error message
- [ ] Login with correct credentials → Navigate to Home
- [ ] Click Register → Navigate to Register screen
- [ ] Register with existing email → Error message
- [ ] Register with mismatched passwords → Error message
- [ ] Register successfully → Navigate to Home
- [ ] Logout → Return to Login

#### Project Management
- [ ] Click "View Projects" → Navigate to ProjectList
- [ ] Empty state shows message
- [ ] Click FAB → Create dialog appears
- [ ] Create project with empty name → Error
- [ ] Create project successfully → Appears in list
- [ ] Click project card → Navigate to TaskList
- [ ] Delete project → Removed from list
- [ ] Error handling → Snackbar shows message

#### Task Management
- [ ] Empty task list shows message
- [ ] Click FAB → Create dialog appears
- [ ] Create task with empty title → Error
- [ ] Create task successfully → Appears in list
- [ ] Click status chip → Dropdown appears
- [ ] Change status → Updates immediately
- [ ] Delete task → Removed from list
- [ ] Back navigation → Returns to ProjectList

#### Task Details
- [ ] Click task card → Navigate to TaskDetail
- [ ] All information displays correctly
- [ ] Status dropdown works
- [ ] Edit button ready
- [ ] Delete button works
- [ ] Back navigation works

### Performance Testing
- [ ] App launches in < 2 seconds
- [ ] API calls complete in < 1 second
- [ ] Smooth scrolling in lists
- [ ] No memory leaks
- [ ] Proper state restoration

### Error Scenarios
- [ ] Network offline → Error message
- [ ] Server error → Error message
- [ ] Invalid token → Logout
- [ ] Validation errors → Clear messages

## API Testing

### Using Swagger UI
1. Start backend: `npm run dev`
2. Open browser: `http://localhost:5000/api-docs`
3. Test endpoints interactively

### Using cURL

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

#### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "projectId": "PROJECT_ID",
    "status": "TODO",
    "priority": "MEDIUM"
  }'
```

## Test Data

### Sample Users
```json
{
  "email": "admin@taskmaster.com",
  "password": "admin123",
  "fullName": "Admin User"
}
```

### Sample Projects
```json
{
  "name": "Mobile App Development",
  "description": "Build TaskMaster Android app"
}
```

### Sample Tasks
```json
{
  "title": "Implement login screen",
  "description": "Create login UI with Material 3",
  "status": "DONE",
  "priority": "HIGH"
}
```

## Continuous Integration

### GitHub Actions (Future)
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd backend
          npm install
          npm test
```

## Coverage Reports

### Viewing Coverage
```bash
cd backend
npm run test:coverage
open coverage/lcov-report/index.html
```

### Current Coverage
- **Overall**: 70%+
- **Controllers**: 80%+
- **Routes**: 75%+
- **Models**: 60%+

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Use mocks for database, APIs
3. **Clear Test Names**: Describe what is being tested
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Edge Cases**: Test error scenarios
6. **Clean Up**: Reset state after each test

## Troubleshooting

### Tests Failing
1. Check database connection
2. Verify environment variables
3. Clear test database
4. Update dependencies

### Coverage Too Low
1. Add unit tests for controllers
2. Add integration tests for routes
3. Test error scenarios
4. Test validation logic

## Next Steps

1. Add more integration tests
2. Implement E2E tests
3. Add performance tests
4. Set up CI/CD pipeline
5. Add code quality checks
