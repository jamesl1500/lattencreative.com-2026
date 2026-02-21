import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, StatusBadge, PageHeader, ButtonLink } from "@/components/ui";
import { DeleteButton } from "@/components/FormElements";
import { deleteProjectAction } from "../actions";
import type { Project, Client, Task } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: data ? `${data.title} — Project` : "Project" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, client:clients(id, name, email)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const p = project as Project & { client: Pick<Client, "id" | "name" | "email"> | null };

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("sort_order")
    .order("created_at", { ascending: false });

  const tasksByStatus = {
    todo: (tasks as Task[] ?? []).filter((t) => t.status === "todo"),
    in_progress: (tasks as Task[] ?? []).filter((t) => t.status === "in_progress"),
    review: (tasks as Task[] ?? []).filter((t) => t.status === "review"),
    done: (tasks as Task[] ?? []).filter((t) => t.status === "done"),
  };

  const totalTasks = tasks?.length ?? 0;
  const doneTasks = tasksByStatus.done.length;

  return (
    <div>
      <PageHeader
        title={p.title}
        description={p.client ? `Client: ${p.client.name}` : undefined}
        action={
          <div className="flex items-center gap-3">
            <ButtonLink href={`/projects/${id}/edit`} variant="secondary">
              Edit
            </ButtonLink>
            <ButtonLink href={`/tasks/new?project_id=${id}`}>
              + New Task
            </ButtonLink>
            <DeleteButton
              action={deleteProjectAction.bind(null, id)}
              confirmMessage={`Delete project "${p.title}"? All tasks will also be deleted.`}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {p.description && (
            <Card>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{p.description}</p>
            </Card>
          )}

          {/* Tasks Board */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Tasks {totalTasks > 0 && <span className="text-muted-foreground font-normal">({doneTasks}/{totalTasks})</span>}
              </h2>
              <ButtonLink href={`/tasks/new?project_id=${id}`}>+ New Task</ButtonLink>
            </div>

            {totalTasks > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(["todo", "in_progress", "review", "done"] as const).map((status) => (
                  <div key={status} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge status={status} />
                      <span className="text-xs text-muted-foreground">{tasksByStatus[status].length}</span>
                    </div>
                    <div className="space-y-2">
                      {tasksByStatus[status].map((task) => (
                        <Link
                          key={task.id}
                          href={`/tasks/${task.id}`}
                          className="block rounded-lg bg-muted/50 p-3 hover:bg-muted transition-colors"
                        >
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <StatusBadge status={task.priority} />
                            {task.due_date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No tasks yet. <Link href={`/tasks/new?project_id=${id}`} className="text-primary hover:underline">Add the first task</Link>
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <dl className="space-y-3">
              <InfoItem label="Status"><StatusBadge status={p.status} /></InfoItem>
              <InfoItem label="Priority"><StatusBadge status={p.priority} /></InfoItem>
              <InfoItem
                label="Budget"
                value={p.budget ? `$${(p.budget / 100).toLocaleString()}` : null}
              />
              <InfoItem
                label="Start Date"
                value={p.start_date ? new Date(p.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null}
              />
              <InfoItem
                label="Due Date"
                value={p.due_date ? new Date(p.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null}
              />
              {p.completed_at && (
                <InfoItem
                  label="Completed"
                  value={new Date(p.completed_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                />
              )}
            </dl>
          </Card>

          {p.client && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Client</h2>
              <Link
                href={`/clients/${p.client.id}`}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted transition-colors -m-3"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{p.client.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.client.name}</p>
                  <p className="text-xs text-muted-foreground">{p.client.email}</p>
                </div>
              </Link>
            </Card>
          )}

          {/* Progress */}
          {totalTasks > 0 && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Progress</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium text-foreground">{Math.round((doneTasks / totalTasks) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                  />
                </div>
              </div>
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
