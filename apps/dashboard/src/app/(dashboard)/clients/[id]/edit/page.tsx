import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader } from "@/components/ui";
import { FormField, TextAreaField, SelectField, SubmitButton } from "@/components/FormElements";
import { updateClientAction } from "../../actions";
import type { Client } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("name").eq("id", id).single();
  return { title: data ? `Edit ${data.name}` : "Edit Client" };
}

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const c = client as Client;

  const updateAction = updateClientAction.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit ${c.name}`} />

      <Card className="max-w-2xl">
        <form action={updateAction} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" name="name" required defaultValue={c.name} />
            <FormField label="Email" name="email" type="email" required defaultValue={c.email} />
            <FormField label="Phone" name="phone" type="tel" defaultValue={c.phone ?? ""} />
            <FormField label="Company" name="company" defaultValue={c.company ?? ""} />
            <FormField label="Website" name="website" type="url" defaultValue={c.website ?? ""} />
            <SelectField
              label="Status"
              name="status"
              defaultValue={c.status}
              options={[
                { value: "lead", label: "Lead" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
          <TextAreaField label="Notes" name="notes" defaultValue={c.notes ?? ""} rows={4} />

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton label="Save Changes" />
            <a href={`/clients/${id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
