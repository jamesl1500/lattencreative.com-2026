import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatusBadge, EmptyState, ButtonLink } from "@/components/ui";
import type { Project, Client } from "@/lib/types";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, client:clients(id, name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Track all your active and completed projects."
        action={<ButtonLink href="/projects/new">+ New Project</ButtonLink>}
      />

      {projects && projects.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Client</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Priority</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Due Date</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Budget</th>
              </tr>
            </thead>
            <tbody>
              {(projects as (Project & { client: Pick<Client, "id" | "name"> | null })[]).map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {project.client ? (
                      <Link href={`/clients/${project.client.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {project.client.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={project.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.due_date
                      ? new Date(project.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.budget ? `$${(project.budget / 100).toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          description="Create a project to start tracking work for your clients."
          action={<ButtonLink href="/projects/new">+ New Project</ButtonLink>}
        />
      )}
    </div>
  );
}
