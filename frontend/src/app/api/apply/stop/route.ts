import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = await fetch('http://localhost:8000/stop-applying', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to stop application process')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to stop application process' }, { status: 500 })
  }
} 