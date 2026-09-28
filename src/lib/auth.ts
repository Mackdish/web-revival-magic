import type { User } from "@supabase/supabase-js";
import { supabase } from "./crm-supabase";

export type CrmRole = "admin" | "manager" | "staff";

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getCrmRole(userId: string): Promise<CrmRole | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("crm_members")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.role as CrmRole | undefined) ?? null;
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase authentication is not configured.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
export { supabase };

export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase authentication is not configured.");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
