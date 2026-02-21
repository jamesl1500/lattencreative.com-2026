import { PageHeader, Card } from "@/components/ui";
import { FormField, TextAreaField, SelectField, SubmitButton } from "@/components/FormElements";
import { createClientAction } from "../actions";

export const metadata = { title: "New Client" };

export default function NewClientPage() {
  return (
    <div>
      <PageHeader title="New Client" description="Add a new client to your dashboard." />

      <Card className="max-w-2xl">
        <form action={createClientAction} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" name="name" required placeholder="John Doe" />
            <FormField label="Email" name="email" type="email" required placeholder="john@example.com" />
            <FormField label="Phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
            <FormField label="Company" name="company" placeholder="Acme Inc." />
            <FormField label="Website" name="website" type="url" placeholder="https://example.com" />
            <SelectField
              label="Status"
              name="status"
              defaultValue="active"
              options={[
                { value: "lead", label: "Lead" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
          <TextAreaField label="Notes" name="notes" placeholder="Any internal notes..." rows={4} />

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton label="Create Client" />
            <a href="/clients" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
