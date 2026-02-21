import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";
import { FormField, TextAreaField, SelectField, SubmitButton } from "@/components/FormElements";
import { createProjectAction } from "../actions";
import type { Client } from "@/lib/types";

export const metadata = { title: "New Project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .in("status", ["lead", "active"])
    .order("name");

  return (
    <div>
      <PageHeader title="New Project" description="Create a new project for a client." />

      <Card className="max-w-2xl">
        <form action={createProjectAction} className="space-y-4">
          <FormField label="Title" name="title" required placeholder="Website Redesign" />
          <TextAreaField label="Description" name="description" placeholder="Project details..." rows={4} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Client"
              name="client_id"
              required
              defaultValue={params.client_id}
              options={(clients as Pick<Client, "id" | "name">[] ?? []).map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue="planning"
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
              defaultValue="medium"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
            <FormField label="Budget ($)" name="budget" type="number" placeholder="5000" />
            <FormField label="Start Date" name="start_date" type="date" />
            <FormField label="Due Date" name="due_date" type="date" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton label="Create Project" />
            <a href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
