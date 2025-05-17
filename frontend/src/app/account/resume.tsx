'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Resume({
  uid,
  url,
  onUpload,
}: {
  uid: string | null
  url: string | null
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [resumeUrl, setResumeUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('resumes').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setResumeUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadResume: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a resume to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading resume!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {resumeUrl ? (
        <div>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        </div>
      ) : (
        <div>
          No resume Yet. Upload one
        </div>
      )}
      <div  className="my-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md inline-block">
        <label htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="application/pdf"
          onChange={uploadResume}
          disabled={uploading}
        />
      </div>
    </div>
  )
}