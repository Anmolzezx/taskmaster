# Password Reset API Testing

## Prerequisites
- Backend server running on http://localhost:5000
- Valid user account in database

## Test Flow

### 1. Request Password Reset
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "resetToken": "64-character-hex-string",  // Only in development
    "message": "Password reset token generated"
  },
  "message": "If the email exists, a password reset link has been sent"
}
```

**Note:** In development, the reset token is returned in the response. In production, it should only be sent via email.

### 2. Verify Reset Token (Optional)
```bash
GET /api/auth/verify-reset-token?token={reset_token}
```

**Expected Response (Valid Token):**
```json
{
  "success": true,
  "data": {
    "valid": true
  },
  "message": "Token is valid"
}
```

**Expected Response (Invalid/Expired Token):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token",
  "statusCode": 400
}
```

### 3. Reset Password
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-step-1",
  "newPassword": "newSecurePassword123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Password has been reset successfully"
}
```

## Error Cases

### Email Not Found
```json
// Request
{
  "email": "nonexistent@example.com"
}

// Response (Same as success to prevent email enumeration)
{
  "success": true,
  "data": null,
  "message": "If the email exists, a password reset link has been sent"
}
```

### Expired Token
```json
// Response
{
  "success": false,
  "message": "Reset token has expired",
  "statusCode": 400
}
```

### Invalid New Password
```json
// Request
{
  "token": "valid-token",
  "newPassword": "123"  // Too short
}

// Response
{
  "success": false,
  "message": "\"newPassword\" length must be at least 6 characters long",
  "statusCode": 400
}
```

## Testing with cURL

```bash
# 1. Request password reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 2. Verify token (optional)
curl -X GET "http://localhost:5000/api/auth/verify-reset-token?token=YOUR_RESET_TOKEN"

# 3. Reset password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_RESET_TOKEN","newPassword":"newPassword123"}'

# 4. Test login with new password
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"newPassword123"}'
```

## Security Features

1. **Token Hashing**: Reset tokens are hashed using SHA-256 before storage
2. **Token Expiry**: Tokens expire after 1 hour
3. **Email Enumeration Prevention**: Same response for existing and non-existing emails
4. **One-Time Use**: Tokens are cleared after successful password reset
5. **Validation**: Joi schema validation for all inputs
