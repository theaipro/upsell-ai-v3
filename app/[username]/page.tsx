import { supabase } from "@/lib/supabase-client";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, UserCircle, Calendar } from "lucide-react";
import { format } from 'date-fns';

// This page will be server-side rendered to ensure data is fresh for every request.
export const revalidate = 0;

interface ProfilePageProps {
  params: {
    username: string;
  };
}

// Helper to format dates, returns empty string if date is invalid
const formatDate = (date: string | null) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMMM d, yyyy');
  } catch (error) {
    return 'N/A';
  }
};

async function getStaffProfile(username: string) {
  // The username from the URL might be encoded, so we decode it.
  const decodedUsername = decodeURIComponent(username);

  // Note: Querying by 'name' is not ideal as names may not be unique.
  // A unique 'username' column would be a more robust solution.
  const { data, error } = await supabase
    .from("staff")
    .select(
      `
      name,
      email,
      role,
      status,
      joined_at,
      companies (
        name,
        logo_url
      )
    `
    )
    .eq("name", decodedUsername)
    .limit(1) // Ensure we only get one record, even if names are duplicated
    .single(); // .single() expects exactly one row, which is good.

  if (error || !data) {
    // If no user is found, or if there's an error, render the 404 page.
    notFound();
  }

  // Supabase returns the joined table as a nested object.
  // We rename it here for clarity in the component.
  const { companies: company, ...profileData } = data;

  return {
    ...profileData,
    company: company,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getStaffProfile(params.username);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center bg-gray-100 p-6 border-b">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-md">
            {/* The staff table does not have an avatar_url, so we use a fallback. */}
            <AvatarImage src={profile.company?.logo_url || undefined} alt={profile.name} />
            <AvatarFallback className="text-3xl bg-blue-500 text-white">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
          <p className="text-md text-gray-600 capitalize">{profile.role || "Staff"}</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <Building2 className="w-6 h-6 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{profile.company?.name || "Not Assigned"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <UserCircle className="w-6 h-6 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{profile.status || "Unknown"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Calendar className="w-6 h-6 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{formatDate(profile.joined_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
