# File Upload API Testing

## Prerequisites
- Backend server running on http://localhost:5000
- Valid JWT access token
- Valid task ID

## Test Endpoints

### 1. Upload File to Task
```bash
POST /api/tasks/:taskId/attachments
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Form Data:
- file: [binary file]
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "document-1738148464123-987654321.pdf",
    "originalName": "document.pdf",
    "fileSize": 245678,
    "mimeType": "application/pdf",
    "uploadedAt": "2026-01-29T10:21:04.000Z"
  },
  "message": "File uploaded successfully"
}
```

### 2. Get All Attachments for Task
```bash
GET /api/tasks/:taskId/attachments
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fileName": "document-1738148464123-987654321.pdf",
      "originalName": "document.pdf",
      "fileSize": 245678,
      "mimeType": "application/pdf",
      "createdAt": "2026-01-29T10:21:04.000Z",
      "uploader": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "message": "Retrieved 1 attachment(s)"
}
```

### 3. Download Attachment
```bash
GET /api/attachments/:id
Authorization: Bearer {access_token}
```

**Response:** Binary file download with original filename

### 4. Delete Attachment
```bash
DELETE /api/attachments/:id
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Attachment deleted successfully"
}
```

## File Upload Constraints

### Allowed File Types
- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT
- **Archives**: ZIP

### File Size Limit
- Maximum: 10MB per file

## Error Cases

### No File Uploaded
```json
{
  "success": false,
  "message": "No file uploaded",
  "statusCode": 400
}
```

### Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type. Only images, PDFs, documents, and zip files are allowed.",
  "statusCode": 400
}
```

### File Too Large
```json
{
  "success": false,
  "message": "File too large",
  "statusCode": 400
}
```

### Task Not Found
```json
{
  "success": false,
  "message": "Task not found",
  "statusCode": 404
}
```

### Unauthorized Delete
```json
{
  "success": false,
  "message": "You do not have permission to delete this attachment",
  "statusCode": 403
}
```

## Testing with cURL

```bash
# 1. Upload file
curl -X POST http://localhost:5000/api/tasks/TASK_ID/attachments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/document.pdf"

# 2. Get all attachments for task
curl -X GET http://localhost:5000/api/tasks/TASK_ID/attachments \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Download attachment
curl -X GET http://localhost:5000/api/attachments/ATTACHMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -O -J

# 4. Delete attachment
curl -X DELETE http://localhost:5000/api/attachments/ATTACHMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing with Postman

### Upload File
1. Set method to POST
2. URL: `http://localhost:5000/api/tasks/{taskId}/attachments`
3. Headers: `Authorization: Bearer {token}`
4. Body: Select "form-data"
5. Add key "file" with type "File"
6. Select file to upload
7. Send request

### Download File
1. Set method to GET
2. URL: `http://localhost:5000/api/attachments/{id}`
3. Headers: `Authorization: Bearer {token}`
4. Send request
5. Click "Save Response" to download file

## Security Features

1. **Authentication Required**: All endpoints require valid JWT token
2. **File Type Validation**: Only allowed file types can be uploaded
3. **File Size Limit**: Maximum 10MB per file
4. **Permission Check**: Only uploader can delete attachments
5. **Automatic Cleanup**: Files are deleted from filesystem when attachment is removed
6. **Unique Filenames**: Prevents filename collisions with timestamp + random suffix
