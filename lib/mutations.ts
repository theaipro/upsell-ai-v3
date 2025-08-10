import { supabase } from "./supabase-client"

export async function updateCompany(companyId: string, data: Record<string, any>) {
  const { data: updatedCompany, error } = await supabase
    .from("companies")
    .update(data)
    .eq("id", companyId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedCompany
}

export async function updateStaff(staffId: string, data: Record<string, any>) {
  const { data: updatedStaff, error } = await supabase
    .from("staff")
    .update(data)
    .eq("id", staffId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedStaff
}
