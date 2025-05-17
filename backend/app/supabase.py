from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client():
    return create_client(
        os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    ) 