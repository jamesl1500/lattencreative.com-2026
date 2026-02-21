"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTaskAction(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      project_id: formData.get("project_id") as string,
      status: (formData.get("status") as string) || "todo",
      priority: (formData.get("priority") as string) || "medium",
      due_date: (formData.get("due_date") as string) || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "task",
    entity_id: data.id,
    action: `Task "${data.title}" created`,
  });

  revalidatePath("/tasks");
  revalidatePath("/projects");
  redirect(`/tasks/${data.id}`);
}

export async function updateTaskAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const status = formData.get("status") as string;
  const completed_at = status === "done" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("tasks")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      project_id: formData.get("project_id") as string,
      status,
      priority: (formData.get("priority") as string) || "medium",
      due_date: (formData.get("due_date") as string) || null,
      completed_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "task",
    entity_id: id,
    action: `Task updated to "${status.replace(/_/g, " ")}"`,
  });

  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}

export async function deleteTaskAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "task",
    entity_id: id,
    action: "Task deleted",
  });

  revalidatePath("/tasks");
  revalidatePath("/projects");
  redirect("/tasks");
}

export async function quickUpdateTaskStatus(id: string, status: string) {
  const supabase = await createClient();

  const completed_at = status === "done" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("tasks")
    .update({ status, completed_at })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "task",
    entity_id: id,
    action: `Task status changed to "${status.replace(/_/g, " ")}"`,
  });

  revalidatePath("/tasks");
  revalidatePath("/projects");
}
