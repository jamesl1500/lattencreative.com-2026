import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader } from "@/components/ui";
import { FormField, TextAreaField, SelectField, SubmitButton } from "@/components/FormElements";
import { updateTaskAction } from "../../actions";
import type { Task } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select("title").eq("id", id).single();
  return { title: data ? `Edit ${data.title}` : "Edit Task" };
}

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: task } = await supabase.from("tasks").select("*").eq("id", id).single();
  if (!task) notFound();

  const t = task as Task;

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, client:clients(name)")
    .order("title");

  const updateAction = updateTaskAction.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit ${t.title}`} />

      <Card className="max-w-2xl">
        <form action={updateAction} className="space-y-4">
          <FormField label="Title" name="title" required defaultValue={t.title} />
          <TextAreaField label="Description" name="description" defaultValue={t.description ?? ""} rows={4} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Project"
              name="project_id"
              required
              defaultValue={t.project_id}
              options={(projects ?? []).map((p: { id: string; title: string; client: { name: string }[] | null }) => ({
                value: p.id,
                label: p.client && p.client[0] ? `${p.title} (${p.client[0].name})` : p.title,
              }))}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue={t.status}
              options={[
                { value: "todo", label: "To Do" },
                { value: "in_progress", label: "In Progress" },
                { value: "review", label: "Review" },
                { value: "done", label: "Done" },
              ]}
            />
            <SelectField
              label="Priority"
              name="priority"
              defaultValue={t.priority}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
            <FormField label="Due Date" name="due_date" type="date" defaultValue={t.due_date ?? ""} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton label="Save Changes" />
            <a href={`/tasks/${id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
