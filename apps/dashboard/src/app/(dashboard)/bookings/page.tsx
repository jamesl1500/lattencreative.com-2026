import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatusBadge, EmptyState, ButtonLink } from "@/components/ui";
import type { Booking } from "@/lib/types";

export const metadata = { title: "Bookings" };

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Manage incoming bookings and convert them to clients."
      />

      {bookings && bookings.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Email</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Package</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {(bookings as Booking[]).map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {booking.customer_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{booking.customer_email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{booking.package_title ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {booking.preferred_date
                      ? new Date(booking.preferred_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No bookings yet"
          description="Bookings will appear here when customers submit them through your website."
        />
      )}
    </div>
  );
}
