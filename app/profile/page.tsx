"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  bio: string
  language: string
  timezone: string
  marketing_emails: boolean
  product_updates: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        toast.error("Please sign in to view your profile")
        return
      }

      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
        return
      }

      setProfile({
        id: data.id,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: session.user.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        language: data.language || "en",
        timezone: data.timezone || "america_new_york",
        marketing_emails: data.marketing_emails ?? true,
        product_updates: data.product_updates ?? true,
      })
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePersonalInfo = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to save changes")
        return
      }

      toast.success("Personal information updated successfully")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          language: profile.language,
          timezone: profile.timezone,
          marketing_emails: profile.marketing_emails,
          product_updates: profile.product_updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) {
        console.error("Error updating preferences:", error)
        toast.error("Failed to save preferences")
        return
      }

      toast.success("Preferences updated successfully")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: keyof UserProfile, value: string | boolean) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Failed to load profile. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  value={profile.first_name}
                  onChange={(e) => updateProfile("first_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  value={profile.last_name}
                  onChange={(e) => updateProfile("last_name", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={profile.bio}
                onChange={(e) => updateProfile("bio", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={handleSavePersonalInfo} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience with Upsell AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language">Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language for the interface.</p>
              </div>
              <div className="w-[180px]">
                <select
                  id="language"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={profile.language}
                  onChange={(e) => updateProfile("language", e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Time zone</Label>
                <p className="text-sm text-muted-foreground">Set your local time zone for accurate reporting.</p>
              </div>
              <div className="w-[180px]">
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={profile.timezone}
                  onChange={(e) => updateProfile("timezone", e.target.value)}
                >
                  <option value="america_new_york">America/New York</option>
                  <option value="america_los_angeles">America/Los Angeles</option>
                  <option value="europe_london">Europe/London</option>
                  <option value="asia_tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing">Marketing emails</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new features and improvements.</p>
              </div>
              <Switch
                id="marketing"
                checked={profile.marketing_emails}
                onCheckedChange={(checked) => updateProfile("marketing_emails", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="updates">Product updates</Label>
                <p className="text-sm text-muted-foreground">Get notified when we release new updates.</p>
              </div>
              <Switch
                id="updates"
                checked={profile.product_updates}
                onCheckedChange={(checked) => updateProfile("product_updates", checked)}
              />
            </div>

            <Button onClick={handleSavePreferences} disabled={saving}>
              {saving ? "Saving..." : "Save preferences"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
