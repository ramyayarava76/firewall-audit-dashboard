# Firewall Audit Backend

FastAPI backend service for firewall audit workflows.

## Features

- Health and root status endpoints
- File upload API for CSV and JSON files
- Basic firewall audit endpoint scaffold
- Environment-based configuration with `.env`

## Tech Stack

- Python 3.10+
- FastAPI
- Uvicorn
- Pydantic Settings

## Project Structure

```text
.
|-- config.py
|-- file_handler.py
|-- main.py
|-- upload.py
|-- requirements.txt
`-- README.md
```

## Setup

1. Clone the repository.
2. Create and activate a virtual environment.
3. Install dependencies.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the project root (optional, defaults are provided in code):

```env
EMAIL=ramyayarava76@gmail.com
USERNAME=ramyayarava76
APP_NAME=Firewall Audit Backend
APP_VERSION=1.0.0
DEBUG=false
```

## Run the API

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API base URL: `http://127.0.0.1:8000`

## Available Endpoints

- `GET /` - Service info and status
- `GET /health` - Health check
- `GET /api/v1/audit` - Firewall audit logs placeholder
- `POST /api/v1/upload` - Upload one or more CSV/JSON files

## Upload Request Example

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/upload" \
	-F "files=@sample.csv" \
	-F "files=@sample.json"
```

## Development Notes

- Supported upload file types: `.csv`, `.json`
- Parsed file content is returned directly in the response

## License

This project is for educational/internal use.
