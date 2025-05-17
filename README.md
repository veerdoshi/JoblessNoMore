# JoblessNoMore

A web application built with FastAPI (backend) and Next.js (frontend). Supabase is used for authentication and database.

To run this application, create a free Supabase project.

## Running the Project

1. Complete setup instructions listed below
2. Go to your localhost (e.g. localhost:3000) and login via /login page with these these testing credentials:
   test@example.com, TestTestTest33
3. Go to profile page. You can edit profile information, upload a new resume PDF, or view the existing resume for this account.
4. View the existing resume and download it to your Downloads folder, saving it as "Resume.pdf". This will be used for the job application agent, as it is run locally on your computer for the MVP.
5. Navigate to Applications and start applying or reach out to a recruiter for an existing application.

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

3. Create a `.env` in /backend/app with the contents:
```
NEXT_PUBLIC_SUPABASE_URL=<YOUR SUPABASE URL>
SUPABASE_SERVICE_KEY=<YOUR SUPABASE ANON KEY>
OPENAI_API_KEY=<YOUR OPENAI KEY>
```

3. Run the FastAPI application (in /backend):
```bash
uvicorn app.main:app --reload
```

### Frontend Setup (in /frontend)
Create `.env.local` with the contents:
```
NEXT_PUBLIC_SUPABASE_URL=<YOUR SUPABASE URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR SUPABASE ANON KEY>
```

1. Install dependencies:
```bash
npm install
```

2. Run the Next.js application:
```bash
npm run dev
```
