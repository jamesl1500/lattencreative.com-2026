"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      client_id: formData.get("client_id") as string,
      status: (formData.get("status") as string) || "planning",
      priority: (formData.get("priority") as string) || "medium",
      budget: formData.get("budget") ? parseInt(formData.get("budget") as string, 10) * 100 : null,
      start_date: (formData.get("start_date") as string) || null,
      due_date: (formData.get("due_date") as string) || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "project",
    entity_id: data.id,
    action: `Project "${data.title}" created`,
  });

  revalidatePath("/projects");
  revalidatePath("/clients");
  redirect(`/projects/${data.id}`);
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const status = formData.get("status") as string;
  const completed_at = status === "completed" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("projects")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      client_id: formData.get("client_id") as string,
      status,
      priority: (formData.get("priority") as string) || "medium",
      budget: formData.get("budget") ? parseInt(formData.get("budget") as string, 10) * 100 : null,
      start_date: (formData.get("start_date") as string) || null,
      due_date: (formData.get("due_date") as string) || null,
      completed_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "project",
    entity_id: id,
    action: `Project updated`,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "project",
    entity_id: id,
    action: "Project deleted",
  });

  revalidatePath("/projects");
  revalidatePath("/clients");
  redirect("/projects");
}
