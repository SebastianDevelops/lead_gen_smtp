# SMTP Server API Documentation

## Base URL
```
https://zimail-api.onrender.com
```

## Endpoints

### 1. Send Email
Send an email with optional attachments.

**Endpoint:** `POST /send-email`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "string (required)",
  "subject": "string (required)", 
  "text": "string (optional)",
  "html": "string (optional)",
  "attachments": [
    {
      "filename": "string",
      "content": "string"
    }
  ]
}
```

**Parameters:**
- `to` - Recipient email address
- `subject` - Email subject line
- `text` - Plain text email body (optional)
- `html` - HTML email body (optional)
- `attachments` - Array of file attachments (optional)
  - `filename` - Name of the attachment file
  - `content` - File content as string

**Success Response:**
```json
{
  "success": true,
  "messageId": "<message-id@gmail.com>"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Email sent successfully
- `400` - Missing required fields
- `500` - Server error

**Examples:**

Basic email:
```bash
curl -X POST https://zimail-api.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello",
    "text": "Hello World!"
  }'
```

HTML email:
```bash
curl -X POST https://zimail-api.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "HTML Email",
    "html": "<h1>Hello</h1><p>This is HTML content</p>"
  }'
```

Email with CSV attachment:
```bash
curl -X POST https://zimail-api.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Data Export",
    "text": "Please find the data attached.",
    "attachments": [
      {
        "filename": "data.csv",
        "content": "name,email\nJohn,john@example.com\nJane,jane@example.com"
      }
    ]
  }'
```

### 2. Health Check
Check if the server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "service": "SMTP Server"
}
```

**Example:**
```bash
curl https://zimail-api.onrender.com/health
```

## CORS
CORS is enabled for all domains. The API can be called from any web application.

## Error Handling
All endpoints return appropriate HTTP status codes and error messages in JSON format.

## Rate Limiting
No rate limiting is currently implemented. Consider adding rate limiting for production use.