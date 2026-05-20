# Firewall Audit Dashboard

A small full-stack app to upload firewall logs, parse them, and view an audit summary.

## Features

- Upload `.log`, `.txt`, `.csv`, and `.json` files
- Parse records into structured entries
- Show summary metrics (`total`, `blocked`, `allowed`, `other`)
- Display parsed rows in the dashboard

## Tech Stack

- Frontend: React 18 (`react-scripts`)
- Backend: Node.js + Express + Multer

## Project Structure

```text
firewall-audit-dashboard/
	src/                 # React frontend
	public/
	server/              # Express backend
	README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd server
npm install
cd ..
```

3. Start backend (`http://localhost:5000`):

```bash
cd server
node index.js
```

4. In a new terminal, start frontend (`http://localhost:3000`):

```bash
npm start
```

## Environment Variables

Frontend (`.env` in project root):

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

Backend (`server/.env`):

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
```

## API

- `GET /api/health` - Health check
- `POST /api/upload` - Upload a file (`multipart/form-data`, field name: `file`)

## Frontend Scripts

- `npm start` - Start frontend dev server
- `npm run build` - Build frontend for production
- `npm test` - Run tests

## Notes

- Max upload size is 10 MB.
- Upload API response is capped to 500 parsed rows.