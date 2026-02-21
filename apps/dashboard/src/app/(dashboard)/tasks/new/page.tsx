import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";
import { FormField, TextAreaField, SelectField, SubmitButton } from "@/components/FormElements";
import { createTaskAction } from "../actions";
import type { Project } from "@/lib/types";

export const metadata = { title: "New Task" };

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ project_id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, client:clients(name)")
    .in("status", ["planning", "in_progress", "review"])
    .order("title");

  return (
    <div>
      <PageHeader title="New Task" description="Add a task to a project." />

      <Card className="max-w-2xl">
        <form action={createTaskAction} className="space-y-4">
          <FormField label="Title" name="title" required placeholder="Design homepage mockup" />
          <TextAreaField label="Description" name="description" placeholder="Task details..." rows={4} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Project"
              name="project_id"
              required
              defaultValue={params.project_id}
              options={(projects ?? []).map((p: { id: string; title: string; client: { name: string }[] | null }) => ({
                value: p.id,
                label: p.client && p.client[0] ? `${p.title} (${p.client[0].name})` : p.title,
              }))}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue="todo"
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
              defaultValue="medium"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
            <FormField label="Due Date" name="due_date" type="date" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton label="Create Task" />
            <a href="/tasks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
