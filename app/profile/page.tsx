import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import ProfileForm from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Your Profile</h1>
        <ProfileForm user={session.user} />
      </div>
    </div>
  )
}