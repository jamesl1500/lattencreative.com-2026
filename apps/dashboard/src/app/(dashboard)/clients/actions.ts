"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      company: (formData.get("company") as string) || null,
      website: (formData.get("website") as string) || null,
      notes: (formData.get("notes") as string) || null,
      status: (formData.get("status") as string) || "active",
      source: "manual",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "client",
    entity_id: data.id,
    action: `Client "${data.name}" created`,
    details: `Source: Manual`,
  });

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      company: (formData.get("company") as string) || null,
      website: (formData.get("website") as string) || null,
      notes: (formData.get("notes") as string) || null,
      status: formData.get("status") as string,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "client",
    entity_id: id,
    action: `Client updated`,
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "client",
    entity_id: id,
    action: "Client deleted",
  });

  revalidatePath("/clients");
  redirect("/clients");
}
