import { createClient } from "@/utils/supabase/server"
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    
    // Start the Python script
    const response = await fetch('http://localhost:8000/start-applying', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      throw new Error('Failed to start application process')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start application process' }, { status: 500 })
  }
} 