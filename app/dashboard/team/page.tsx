import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// This page will be server-rendered to ensure data is fresh and secure.
export const revalidate = 0

async function getTeamData() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  // Fetch the current user's staff profile to get their company_id and role
  const { data: currentUserStaff, error: userError } = await supabase
    .from("staff")
    .select("company_id, role")
    .eq("user_id", session.user.id)
    .single()

  if (userError || !currentUserStaff) {
    console.error("Error fetching current user's staff profile:", userError)
    // Redirect or show an error if the user doesn't have a staff profile
    redirect("/dashboard")
  }

  // Security Check: Only owners or admins can view the team page
  if (!["owner", "admin"].includes(currentUserStaff.role)) {
    redirect("/dashboard")
  }

  // Fetch all staff members for the user's company
  const { data: team, error: teamError } = await supabase
    .from("staff")
    .select("*")
    .eq("company_id", currentUserStaff.company_id)
    .order("created_at", { ascending: true })

  if (teamError) {
    console.error("Error fetching team data:", teamError)
    // Return empty array on error
    return []
  }

  return team
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
}

export default async function TeamManagementPage() {
  const team = await getTeamData()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your company's staff members and their roles.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.length > 0 ? (
                team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={undefined} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            <Link
                              href={`/${encodeURIComponent(member.name)}`}
                              className="hover:underline"
                            >
                              {member.name}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={member.status === "active" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Actions like 'Edit', 'Remove' can be added here */}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
