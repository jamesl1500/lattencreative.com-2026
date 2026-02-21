import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader } from "@/components/ui";
import { FormField, TextAreaField, SelectField, SubmitButton } from "@/components/FormElements";
import { updateProjectAction } from "../../actions";
import type { Project, Client } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: data ? `Edit ${data.title}` : "Edit Project" };
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const p = project as Project;

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .in("status", ["lead", "active"])
    .order("name");

  const updateAction = updateProjectAction.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit ${p.title}`} />

      <Card className="max-w-2xl">
        <form action={updateAction} className="space-y-4">
          <FormField label="Title" name="title" required defaultValue={p.title} />
          <TextAreaField label="Description" name="description" defaultValue={p.description ?? ""} rows={4} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Client"
              name="client_id"
              required
              defaultValue={p.client_id}
              options={(clients as Pick<Client, "id" | "name">[] ?? []).map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue={p.status}
              options={[
                { value: "planning", label: "Planning" },
                { value: "in_progress", label: "In Progress" },
                { value: "review", label: "Review" },
                { value: "completed", label: "Completed" },
                { value: "on_hold", label: "On Hold" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
            <SelectField
              label="Priority"
              name="priority"
              defaultValue={p.priority}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
            <FormField
              label="Budget ($)"
              name="budget"
              type="number"
              defaultValue={p.budget ? String(p.budget / 100) : ""}
            />
            <FormField label="Start Date" name="start_date" type="date" defaultValue={p.start_date ?? ""} />
            <FormField label="Due Date" name="due_date" type="date" defaultValue={p.due_date ?? ""} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton label="Save Changes" />
            <a href={`/projects/${id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
