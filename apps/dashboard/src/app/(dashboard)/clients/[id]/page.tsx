import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, StatusBadge, PageHeader, ButtonLink } from "@/components/ui";
import { DeleteButton } from "@/components/FormElements";
import { deleteClientAction } from "../actions";
import type { Client, Project } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("name").eq("id", id).single();
  return { title: data ? `${data.name} — Client` : "Client" };
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const c = client as Client;

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title={c.name}
        description={`Client since ${new Date(c.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
        action={
          <div className="flex items-center gap-3">
            <ButtonLink href={`/clients/${id}/edit`} variant="secondary">
              Edit
            </ButtonLink>
            <ButtonLink href={`/projects/new?client_id=${id}`}>
              + New Project
            </ButtonLink>
            <DeleteButton
              action={deleteClientAction.bind(null, id)}
              confirmMessage={`Delete client "${c.name}"? All their projects and tasks will also be deleted.`}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Email" value={c.email} />
              <InfoItem label="Phone" value={c.phone} />
              <InfoItem label="Company" value={c.company} />
              <InfoItem label="Website" value={c.website} />
            </dl>
            {c.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-sm text-muted-foreground mb-1">Notes</dt>
                <dd className="text-sm text-foreground whitespace-pre-wrap">{c.notes}</dd>
              </div>
            )}
          </Card>

          {/* Projects */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              <ButtonLink href={`/projects/new?client_id=${id}`}>+ New Project</ButtonLink>
            </div>
            {projects && projects.length > 0 ? (
              <div className="space-y-3">
                {(projects as Project[]).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.title}</p>
                      {project.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Due {new Date(project.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.priority} />
                      <StatusBadge status={project.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet for this client.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <dl className="space-y-3">
              <InfoItem label="Status">
                <StatusBadge status={c.status} />
              </InfoItem>
              <InfoItem label="Source" value={c.source.replace(/_/g, " ")} />
              <InfoItem
                label="Added"
                value={new Date(c.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
              <InfoItem
                label="Last Updated"
                value={new Date(c.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground mt-0.5 capitalize">
        {children ?? value ?? "—"}
      </dd>
    </div>
  );
}
