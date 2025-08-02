"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Shield, Smartphone, Key, LogOut } from "lucide-react"
import { demoActiveSessions, ActiveSession } from "@/lib/demo-data"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

export default function SecurityPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(demoActiveSessions)

  const handleSignOut = (sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId))
  }

  const handleSignOutOfAllSessions = () => {
    setSessions(sessions.filter((session) => session.is_current))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">Manage your account security and authentication settings.</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type="password" />
            </div>

            <Button>Update password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes.
                  </p>
                </div>
              </div>
              <Switch id="2fa-app" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Security Keys</p>
                  <p className="text-sm text-muted-foreground">Use security keys like YubiKey as a second factor.</p>
                </div>
              </div>
              <Switch id="2fa-key" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage devices where you're currently logged in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <>
                  <div key={session.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.location} •{" "}
                        {session.is_current
                          ? "Current session"
                          : `Last active ${formatDistanceToNow(session.last_active)} ago`}
                      </p>
                    </div>
                    {session.is_current ? (
                      <Button variant="outline" size="sm">
                        <Shield className="mr-2 h-4 w-4" />
                        Current
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleSignOut(session.id)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    )}
                  </div>
                  {index < sessions.length - 1 && <Separator />}
                </>
              ))}
            </div>

            <Button variant="destructive" onClick={handleSignOutOfAllSessions}>
              Sign out of all sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
