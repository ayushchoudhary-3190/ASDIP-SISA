# AI Secure Data Intelligence Platform (ASDIP-SISA)

A data intelligence platform that detects sensitive information (passwords, API keys, emails, credit cards) in logs, text, SQL queries, and chat inputs using pattern detection and AI-powered insights.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│ ML Service  │
│   (React)   │     │    (Go)     │     │  (Python)   │
│   Port 3000 │     │  Port 8080  │     │  Port 8000  │
└─────────────┘     └─────────────┘     └─────────────┘
```

- **Frontend**: React + Tailwind + Vite (Port 3000)
- **Backend**: Go with Gin framework (Port 8080)
- **ML Service**: Python FastAPI (Port 8000)

## Features

- **Sensitive Data Detection**: Detects passwords, API keys, emails, credit cards
- **AI Insights**: Uses Gemini API for advanced threat analysis
- **Policy Engine**: Blocks requests based on configurable policies
- **Rate Limiting**: 30 requests/minute per IP
- **File Size Limits**: 5MB for uploads, 10MB for content
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Brute-Force Detection**: Detects 3+ failed login attempts from same IP
- **Prometheus Metrics**: `/metrics` endpoint for monitoring

## Prerequisites

- **Backend**: Go 1.21+
- **ML Service**: Python 3.10+, pip
- **Frontend**: Node.js 18+, npm

## Environment Variables

### ML Service (`ml-service/.env`)
```
GEMINI_API_KEY=your-gemini-api-key-here
ML-URL=http://localhost:8000
PYTHON_PORT=8000
```

### Backend (`backend-go`)
```
ML-URL=http://localhost:8000
GO_PORT=8080
```

### Frontend (`frontend-react`)
```
VITE_API_URL=http://localhost:8080
```

## Local Development

### Option 1: Docker Compose (Recommended)
```bash
# From project root
docker compose up --build
```

Services available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- ML Service: http://localhost:8000

### Option 2: Manual Setup

**1. ML Service (Python)**
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**2. Backend (Go)**
```bash
cd backend-go
go run cmd/server/main.go
```

**3. Frontend (React)**
```bash
cd frontend-react
npm install
npm run dev
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/analyze` | POST | Analyze text/logs |
| `/analyze/file` | POST | Analyze uploaded file |
| `/metrics` | GET | Prometheus metrics |

### Analyze Request Examples

**Text Analysis:**
```bash
curl -X POST http://localhost:8080/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "User login: john@example.com, Password: secret123",
    "input_type": "text"
  }'
```

**Log Analysis:**
```bash
curl -X POST http://localhost:8080/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "2024-01-01 ERROR Failed login for admin@company.com",
    "input_type": "log"
  }'
```

**SQL Analysis:**
```bash
curl -X POST http://localhost:8080/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "SELECT * FROM users WHERE email = \"admin@test.com\" AND password = \"pass123\"",
    "input_type": "sql"
  }'
```

**File Analysis:**
```bash
curl -X POST http://localhost:8080/analyze/file \
  -F "file=@/path/to/logfile.log" \
  -F "input_type=log"
```

## Deployment

### Backend + ML Service (Render/Railway)

1. Create account on Render.com
2. Connect GitHub repository
3. Deploy `backend-go` service:
   - Root directory: `backend-go`
   - Environment variables: `ML-URL=<ml-service-url>`, `GO_PORT=8080`
4. Deploy `ml-service`:
   - Root directory: `ml-service`
   - Environment variables: `GEMINI_API_KEY=<your-key>`, `PYTHON_PORT=8000`
5. Update backend `ML-URL` to point to ML service URL

### Frontend (Vercel)

1. Create account on Vercel.com
2. Connect GitHub repository
3. Select `frontend-react` directory
4. Set environment variable: `VITE_API_URL=<backend-url>`
5. Deploy

## Security

- Rate limiting: 30 requests/minute per IP
- File size limit: 5MB
- Content size limit: 10MB
- Security headers enabled
- Brute-force attack detection

## License

MIT