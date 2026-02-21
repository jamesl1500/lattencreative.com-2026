import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatusBadge, EmptyState, ButtonLink } from "@/components/ui";
import type { Client } from "@/lib/types";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your client relationships."
        action={<ButtonLink href="/clients/new">+ New Client</ButtonLink>}
      />

      {clients && clients.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Email</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Company</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Source</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {(clients as Client[]).map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.company ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize text-muted-foreground">{client.source.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(client.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No clients yet"
          description="Add a client manually or convert a booking to create your first client."
          action={<ButtonLink href="/clients/new">+ New Client</ButtonLink>}
        />
      )}
    </div>
  );
}
