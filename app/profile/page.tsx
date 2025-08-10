"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { updateStaff } from "@/lib/mutations"
import { supabase } from "@/lib/supabase-client"

export default function ProfilePage() {
  const { user } = useAuth()
  const [staffData, setStaffData] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [staffId, setStaffId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      const fetchStaffData = async () => {
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (error) {
          console.error("Error fetching staff data:", error)
        } else if (data) {
          setStaffData({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
          })
          setStaffId(data.id)
        }
        setIsLoading(false)
      }
      fetchStaffData()
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setStaffData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveChanges = async () => {
    if (!staffId) return

    setIsSaving(true)
    try {
      await updateStaff(staffId, staffData)
      // Optionally, show a success message
    } catch (error) {
      console.error("Failed to update profile:", error)
      // Optionally, show an error message
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={staffData.name} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={staffData.email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" value={staffData.phone} onChange={handleInputChange} />
          </div>

          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
