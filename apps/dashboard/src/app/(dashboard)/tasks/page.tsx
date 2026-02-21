import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatusBadge, EmptyState, ButtonLink } from "@/components/ui";
import type { Task, Project } from "@/lib/types";

export const metadata = { title: "Tasks" };

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, project:projects(id, title)")
    .order("status")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="View and manage all tasks across projects."
        action={<ButtonLink href="/tasks/new">+ New Task</ButtonLink>}
      />

      {tasks && tasks.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Project</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Priority</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {(tasks as (Task & { project: Pick<Project, "id" | "title"> | null })[]).map((task) => (
                <tr key={task.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {task.project ? (
                      <Link href={`/projects/${task.project.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {task.project.title}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={task.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No tasks yet"
          description="Create tasks under projects to track your work."
          action={<ButtonLink href="/tasks/new">+ New Task</ButtonLink>}
        />
      )}
    </div>
  );
}
