import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/ui";
import { DeleteButton } from "@/components/FormElements";
import { deleteContactAction } from "./actions";
import type { Contact } from "@/lib/types";

export const metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Messages submitted through the contact form."
      />

      {contacts && contacts.length > 0 ? (
        <div className="space-y-4">
          {(contacts as Contact[]).map((contact) => (
            <div
              key={contact.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {contact.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{contact.subject}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(contact.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                  >
                    Reply
                  </a>
                  <DeleteButton
                    action={deleteContactAction.bind(null, contact.id)}
                    confirmMessage={`Delete message from ${contact.name}?`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No contact messages"
          description="Contact form submissions will appear here."
        />
      )}
    </div>
  );
}
