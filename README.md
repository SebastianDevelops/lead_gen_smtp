# SMTP Server with Gmail

## Setup
```bash
npm install
npm run build
npm start
```

## Usage

### Send Email via API
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "Hello from SMTP server!",
    "attachments": [
      {
        "filename": "data.csv",
        "content": "name,email\nJohn,john@example.com"
      }
    ]
  }'
```

### Send CSV Attachment
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Extracted Records",
    "text": "Please find the extracted records attached.",
    "attachments": [
      {
        "filename": "records.csv",
        "content": "id,name,email\n1,John Doe,john@example.com\n2,Jane Smith,jane@example.com"
      }
    ]
  }'
```