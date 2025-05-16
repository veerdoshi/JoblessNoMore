"use client"

import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { useState, useCallback, useEffect } from "react"

export default function Applications({user}: {user: User | null}) {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Array<any>>([])

  const getApplications = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('applications')
        .select(`apply_date, job_name, job_link, company, status`)
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

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
        {loading && <p>Loading applications...</p>}
        {!loading && applications.length === 0 && <p>No applications found</p>}
        {!loading && applications.length > 0 && (
          <ul>
              {applications.map((application) => (
                  <li key={application.id}>
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