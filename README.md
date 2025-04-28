# JoblessNoMore

A web application built with FastAPI (backend) and Next.js (frontend).

## Project Structure

**/backend**

  /app
  
**/frontend**

  /src/app

## Setup Instructions

### Backend Setup (in /backend)
1. Create and activate a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI application (in /backend):
```bash
uvicorn app.main:app --reload
```

### Frontend Setup (in /frontend)
1. Install dependencies:
```bash
npm install
```

2. Run the Next.js application:
```bash
npm run dev
```
