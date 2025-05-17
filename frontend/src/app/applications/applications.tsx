"use client"

import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { useState, useCallback, useEffect } from "react"

export default function Applications({user}: {user: User | null}) {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Array<any>>([])
  const [isApplying, setIsApplying] = useState(false)

  const getApplications = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('applications')
        .select(`apply_date, job_name, company, status`)
        .eq('profile_id', user?.id)

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setApplications(data)
      }
    } catch (error) {
      console.error(error)
      alert('Error loading applications')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])
  
  useEffect(() => {
    getApplications()
  }, [user, getApplications])

  const toggleApplying = async () => {
    if (!isApplying) {
      // Start applying
      const response = await fetch('/api/apply/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      })
      
      if (response.ok) {
        setIsApplying(true)
      } else {
        alert('Failed to start application process')
      }
    } else {
      // Stop applying
      const response = await fetch('/api/apply/stop', {
        method: 'POST',
      })
      
      if (response.ok) {
        setIsApplying(false)
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
        <button
          onClick={toggleApplying}
          className={`px-4 py-2 font-semibold rounded-md shadow-sm text-white ${
            isApplying ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isApplying ? 'Stop Applying' : 'Start Applying'}
        </button>
      </div>
      {loading && <p>Loading applications...</p>}
      {!loading && applications.length === 0 && <p>No applications found</p>}
      {!loading && applications.length > 0 && (
        <ul>
            {applications.map((application) => (
                <li key={application.id} className="text-black">
                    <p>{application.job_name}</p>
                    <p>{application.company}</p>
                    <p>{application.status}</p>
                    <p>{application.apply_date}</p>
                </li>
            ))}
        </ul>
      )}
    </div>
  )
}