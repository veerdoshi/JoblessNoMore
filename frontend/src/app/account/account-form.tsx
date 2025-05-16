'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Resume from './resume'

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [firstname, setFirstname] = useState<string | null>(null)
  const [lastname, setLastname] = useState<string | null>(null)
  const [education, setEducation] = useState<string | null>(null)
  const [swe, setSwe] = useState<boolean>(false)
  const [dataSci, setDataSci] = useState<boolean>(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, firstname, lastname, education, jobPreferences, resumeUrl`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setUsername(data.username)
        setFirstname(data.firstname)
        setLastname(data.lastname)
        setEducation(data.education)
        const jobPreferences = JSON.parse(data.jobPreferences)
        setSwe(Boolean(jobPreferences?.["swe"]))
        setDataSci(Boolean(jobPreferences?.["dataSci"]))
        setResumeUrl(data.resumeUrl)
      }
    } catch (error) {
      console.error(error)
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    firstname,
    lastname,
    education,
    swe,
    dataSci,
    resumeUrl,
  }: {
    username: string | null
    firstname: string | null
    lastname: string | null
    education: string | null
    swe: boolean
    dataSci: boolean
    resumeUrl: string | null
  }) {
    try {
      setLoading(true)
      console.log("User", user)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        username,
        firstname,
        lastname,
        education,
        jobPreferences: JSON.stringify({
          swe,
          dataSci
        }),
        resumeUrl,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      console.error(error)
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
      <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="text"
          value={user?.email}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          id="firstname"
          type="text"
          value={firstname || ''}
          onChange={(e) => setFirstname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          id="lastname"
          type="text"
          value={lastname || ''}
          onChange={(e) => setLastname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
        <input
          id="education"
          type="text"
          value={education || ''}
          onChange={(e) => setEducation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>

    <fieldset className="border-t pt-4">
      <legend className="text-sm font-medium text-gray-700 mb-2">Job Preferences</legend>
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            id="swe"
            checked={swe}
            onChange={e => setSwe(e.target.checked)}
            className="form-checkbox text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Software Engineering</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            id="datasci"
            checked={dataSci}
            onChange={e => setDataSci(e.target.checked)}
            className="form-checkbox text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Data Science</span>
        </label>
      </div>
    </fieldset>

    <Resume
      uid={user?.id}
      url={resumeUrl}
      onUpload={url => {
        setResumeUrl(url)
        updateProfile({
          username,
          firstname,
          lastname,
          education,
          swe,
          dataSci,
          resumeUrl: url,
        })
      }}
    />

    <div className="space-y-2">
      <button
        onClick={() => updateProfile({ username, firstname, lastname, education, swe, dataSci, resumeUrl })}
        disabled={loading}
        className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        {loading ? 'Loading...' : 'Update Profile'}
      </button>

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600"
        >
          Sign out
        </button>
      </form>
    </div>
{/*     
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="firstname">First Name</label>
        <input
          id="firstname"
          type="text"
          value={firstname || ''}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastname">Last Name</label>
        <input
          id="lastname"
          type="text"
          value={lastname || ''}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="education">Education</label>
        <input
          id="education"
          type="text"
          value={education || ''}
          onChange={(e) => setEducation(e.target.value)}
        />
      </div>
      <fieldset>
        <legend>Job Preferences</legend>
        <div>
          <input type="checkbox" id="swe" name="interest" value="swe" checked={swe} onChange={e => setSwe(e.target.checked)}/>
          <label htmlFor="swe">Software Engineering</label>
        </div>
        <div>
          <input type="checkbox" id="datasci" name="interest" value="datasci" checked={dataSci} onChange={e => setDataSci(e.target.checked)}/>
          <label htmlFor="datasci">Data Science</label>
        </div>
      </fieldset>

      <Resume uid={user?.id} url={resumeUrl} onUpload={url => {
        setResumeUrl(url)
        updateProfile({
          username,
          firstname,
          lastname,
          education,
          swe,
          dataSci,
          resumeUrl: url,
        })
      }} />


      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, firstname, lastname, education, swe, dataSci, resumeUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div> */}
    </div>
  )
}