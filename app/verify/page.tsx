import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full text-center p-8 bg-white shadow-lg rounded-lg">
        <Mail className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent an email to you. Please check your inbox and click the link in the email to verify your account.
        </p>
      </div>
    </div>
  )
}
