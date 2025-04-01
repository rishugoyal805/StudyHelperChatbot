import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import SignupForm from "@/components/auth/signup-form"

export default async function SignupPage() {
  const session = await getSession()

  if (session) {
    redirect("/chat")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Create an Account</h1>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}

