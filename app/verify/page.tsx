import { redirect } from "next/navigation"

export default function VerifyPage() {
  redirect("/auth/verify")
}
