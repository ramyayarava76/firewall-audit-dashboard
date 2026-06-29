# Firewall Audit Dashboard

React + Express application for uploading firewall logs and viewing parsed audit insights.

## Features

- Upload firewall logs from the UI
- Backend parsing for `.log`, `.txt`, `.csv`, and `.json` files
- Summary metrics for total, blocked, allowed, and risk count
- Dashboard views with charts and rules table
- Unit and integration tests for frontend and backend

## Tech Stack

- Frontend: React 18, React Router, Chart.js
- Backend: Node.js, Express, Multer
- Testing: React Testing Library, Jest, Supertest

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- components/
|   |-- pages/
|   |-- styles/
|   `-- utils/
|-- server/
|   |-- routes/
|   `-- __tests__/
|-- package.json
`-- README.md
```

## Requirements

- Node.js 18+
- npm 9+

## Setup

1. Install root dependencies (frontend).
2. Install server dependencies.

```powershell
npm install
npm --prefix server install
```

## Environment Variables

Create `.env` files from the provided templates if needed.

### Root `.env`

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### `server/.env`

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
USERNAME=unknown
```

## Run Locally

Use two terminals:

1. Start backend:

```powershell
npm --prefix server start
```

2. Start frontend:

```powershell
npm start
```

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:5000/api/health`

## API Endpoints

- `GET /api/health` - Backend health check
- `POST /api/upload` - Upload a single file using form field `file`

## Testing

```powershell
npm run test:client
npm run test:server
npm run test:e2e
```

## Build

```powershell
npm run build
```

## Notes

- Uploaded files are processed in memory and not saved to disk.
- API response returns parsed entries (capped to 500 rows) and summary metrics.
