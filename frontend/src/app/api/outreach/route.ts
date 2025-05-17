import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const response = await fetch('http://localhost:8000/start-outreach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: data.company_name,
        job_name: data.job_name,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to start outreach process')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start outreach process' }, { status: 500 })
  }
} 