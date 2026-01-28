# User Profile API Testing

## Prerequisites
- Backend server running on http://localhost:5000
- Valid JWT access token from login

## Test Endpoints

### 1. Get User Profile
```bash
GET /api/users/profile
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": null,
    "createdAt": "2026-01-29T00:00:00.000Z",
    "updatedAt": "2026-01-29T00:00:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

### 2. Update User Profile
```bash
PUT /api/users/profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2026-01-29T00:00:00.000Z",
    "updatedAt": "2026-01-29T00:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

### 3. Update Password
```bash
PUT /api/users/password
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Password updated successfully"
}
```

## Validation Tests

### Invalid Profile Update
```json
{
  "fullName": "A",  // Too short (min 2 chars)
  "avatarUrl": "not-a-url"  // Invalid URL format
}
```

**Expected Error:**
```json
{
  "success": false,
  "message": "\"fullName\" length must be at least 2 characters long",
  "statusCode": 400
}
```

### Invalid Password Update
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "123"  // Too short (min 6 chars)
}
```

**Expected Error:**
```json
{
  "success": false,
  "message": "\"newPassword\" length must be at least 6 characters long",
  "statusCode": 400
}
```

### Wrong Current Password
```json
{
  "currentPassword": "wrongPassword",
  "newPassword": "newPassword456"
}
```

**Expected Error:**
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "statusCode": 401
}
```

## Testing with cURL

```bash
# 1. Login first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Get profile
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Update profile
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Updated Name"}'

# 4. Update password
curl -X PUT http://localhost:5000/api/users/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"password123","newPassword":"newPassword456"}'
```
