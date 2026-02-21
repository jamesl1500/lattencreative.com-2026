import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, StatusBadge, PageHeader, ButtonLink } from "@/components/ui";
import { DeleteButton } from "@/components/FormElements";
import { deleteTaskAction, quickUpdateTaskStatus } from "../actions";
import type { Task, Project, Client } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select("title").eq("id", id).single();
  return { title: data ? `${data.title} — Task` : "Task" };
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("tasks")
    .select("*, project:projects(id, title, client:clients(id, name))")
    .eq("id", id)
    .single();

  if (!task) notFound();

  const t = task as Task & {
    project: (Pick<Project, "id" | "title"> & { client: Pick<Client, "id" | "name"> | null }) | null;
  };

  const statusOrder = ["todo", "in_progress", "review", "done"] as const;
  const currentIndex = statusOrder.indexOf(t.status as typeof statusOrder[number]);

  return (
    <div>
      <PageHeader
        title={t.title}
        description={t.project ? `Project: ${t.project.title}` : undefined}
        action={
          <div className="flex items-center gap-3">
            <ButtonLink href={`/tasks/${id}/edit`} variant="secondary">
              Edit
            </ButtonLink>
            <DeleteButton
              action={deleteTaskAction.bind(null, id)}
              confirmMessage={`Delete task "${t.title}"?`}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {t.description && (
            <Card>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.description}</p>
            </Card>
          )}

          {/* Quick Status Update */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {statusOrder.map((status) => (
                <form key={status} action={quickUpdateTaskStatus.bind(null, id, status)}>
                  <button
                    type="submit"
                    disabled={t.status === status}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors capitalize ${
                      t.status === status
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    } disabled:cursor-not-allowed`}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                </form>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <dl className="space-y-3">
              <InfoItem label="Status"><StatusBadge status={t.status} /></InfoItem>
              <InfoItem label="Priority"><StatusBadge status={t.priority} /></InfoItem>
              <InfoItem
                label="Due Date"
                value={t.due_date ? new Date(t.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null}
              />
              {t.completed_at && (
                <InfoItem
                  label="Completed"
                  value={new Date(t.completed_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                />
              )}
              <InfoItem
                label="Created"
                value={new Date(t.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
            </dl>
          </Card>

          {t.project && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Project</h2>
              <Link
                href={`/projects/${t.project.id}`}
                className="block rounded-lg p-3 hover:bg-muted transition-colors -m-3"
              >
                <p className="text-sm font-medium text-foreground">{t.project.title}</p>
                {t.project.client && (
                  <p className="text-xs text-muted-foreground mt-0.5">Client: {t.project.client.name}</p>
                )}
              </Link>
            </Card>
          )}
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
      <dd className="text-sm font-medium text-foreground mt-0.5">{children ?? value ?? "—"}</dd>
    </div>
  );
}
