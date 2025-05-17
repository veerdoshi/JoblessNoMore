from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .auto_apply import AutoApply
from .supabase import get_supabase_client

app = FastAPI()
auto_apply = AutoApply()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/start-applying")
async def start_applying(data: dict):
    try:
        supabase = get_supabase_client()
        
        # Get user profile
        profile = supabase.table('profiles').select('*').eq('id', data['userId']).single().execute()
        
        if not profile.data:
            raise HTTPException(status_code=404, message="User profile not found")
            
        await auto_apply.start(profile.data)
        return {"status": "started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop-applying")
async def stop_applying():
    auto_apply.stop()
    return {"status": "stopped"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)