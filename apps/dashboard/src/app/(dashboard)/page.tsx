import { createClient } from "@/lib/supabase/server";
import { StatCard, Card } from "@/components/ui";
import { StatusBadge } from "@/components/ui";
import Link from "next/link";
import type { Booking, Client, Project, Task, Contact } from "@/lib/types";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const supabase = await createClient();

  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: activeClients },
    { count: activeProjects },
    { count: pendingTasks },
    { count: totalContacts },
    { data: recentBookings },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).in("status", ["pending", "confirmed"]),
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("projects").select("*", { count: "exact", head: true }).in("status", ["planning", "in_progress", "review"]),
    supabase.from("tasks").select("*", { count: "exact", head: true }).in("status", ["todo", "in_progress"]),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome to the Latten Creative dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Bookings" value={totalBookings ?? 0} />
        <StatCard label="Pending Bookings" value={pendingBookings ?? 0} />
        <StatCard label="Active Clients" value={activeClients ?? 0} />
        <StatCard label="Active Projects" value={activeProjects ?? 0} />
        <StatCard label="Pending Tasks" value={pendingTasks ?? 0} />
        <StatCard label="Contacts" value={totalContacts ?? 0} />
      </div>

      {/* Recent Bookings + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
            <Link href="/bookings" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentBookings && recentBookings.length > 0 ? (
            <div className="space-y-3">
              {(recentBookings as Booking[]).map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {booking.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity: { id: string; action: string; entity_type: string; details: string | null; created_at: string }) => (
                <div key={activity.id} className="flex items-start gap-3 rounded-lg p-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary capitalize">
                      {activity.entity_type[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{activity.action}</p>
                    {activity.details && (
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
