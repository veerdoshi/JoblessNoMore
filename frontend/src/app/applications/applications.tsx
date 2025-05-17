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
        .select(`id, apply_date, job_name, company, status`)
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

  const startOutreach = async (company_name: string, job_name: string) => {
    try {
      const response = await fetch('/api/outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_name, job_name }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to start outreach')
      }
      
      alert('Started LinkedIn outreach process')
    } catch (error) {
      alert('Failed to start outreach process')
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
        <ul className="space-y-4">
          {applications.map((application, index) => (
            <li 
              key={`${application.company}-${application.job_name}-${application.apply_date}`}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {application.job_name}
                  </h3>
                  <p className="text-gray-600">
                    {application.company}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      application.status === 'Interview' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(application.apply_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => startOutreach(application.company, application.job_name)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
                  >
                    Reach Out
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}