'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Jobless No More</h1>

        <div className="space-y-4">
          <Link
            href="/account"
            className="text-blue-600 hover:underline text-lg"
          >
            Account Settings
          </Link>

          <br />

          <Link
            href="/applications"
            className="text-blue-600 hover:underline text-lg"
          >
            View Applications
          </Link>

          <br />

          <Link
            href="/applications"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition block"
          >
            Apply for Jobs
          </Link>
        </div>
      </div>
    </main>
  );

  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Message from backend: {message}</h1>
    </main>
  )
}