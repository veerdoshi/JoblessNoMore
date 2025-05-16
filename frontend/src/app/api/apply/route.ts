import { createClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ message: 'User not logged in' }, { status: 401 })
  }

  return Response.json({ message: `Hello, ${user.email}` })
}