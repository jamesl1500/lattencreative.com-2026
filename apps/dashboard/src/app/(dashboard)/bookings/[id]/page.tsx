import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, StatusBadge, PageHeader } from "@/components/ui";
import { DeleteButton, SelectField } from "@/components/FormElements";
import { updateBookingStatus, deleteBooking, convertBookingToClient } from "../actions";
import type { Booking } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("bookings").select("customer_name").eq("id", id).single();
  return { title: data ? `${data.customer_name} — Booking` : "Booking" };
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (!booking) notFound();

  const b = booking as Booking;

  // Check if already converted
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id, name")
    .eq("booking_id", id)
    .single();

  return (
    <div>
      <PageHeader
        title={b.customer_name}
        description={`Booking from ${new Date(b.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
        action={
          <div className="flex items-center gap-3">
            {!existingClient && (
              <form action={convertBookingToClient.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                >
                  Convert to Client
                </button>
              </form>
            )}
            {existingClient && (
              <a
                href={`/clients/${existingClient.id}`}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                View Client: {existingClient.name}
              </a>
            )}
            <DeleteButton
              action={deleteBooking.bind(null, id)}
              confirmMessage={`Delete booking from ${b.customer_name}? This cannot be undone.`}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Name" value={b.customer_name} />
              <InfoItem label="Email" value={b.customer_email} />
              <InfoItem label="Phone" value={b.customer_phone} />
              <InfoItem label="Company" value={b.company_name} />
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Package" value={b.package_title} />
              <InfoItem
                label="Price"
                value={b.package_price ? `$${(b.package_price / 100).toFixed(2)}` : null}
              />
              <InfoItem
                label="Deposit"
                value={b.deposit_amount ? `$${(b.deposit_amount / 100).toFixed(2)} (50%)` : null}
              />
              <InfoItem label="Current Website" value={b.current_website} />

            </dl>
            {b.project_description && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-sm text-muted-foreground mb-1">Project Description</dt>
                <dd className="text-sm text-foreground whitespace-pre-wrap">{b.project_description}</dd>
              </div>
            )}
            {b.project_goals && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-sm text-muted-foreground mb-1">Project Goals</dt>
                <dd className="text-sm text-foreground whitespace-pre-wrap">{b.project_goals}</dd>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Schedule</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Preferred Date"
                value={b.preferred_date ? new Date(b.preferred_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : null}
              />
              <InfoItem label="Preferred Time" value={b.preferred_time} />
            </dl>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="mb-4">
              <StatusBadge status={b.status} />
            </div>
            <form action={async (formData: FormData) => {
              "use server";
              const status = formData.get("status") as string;
              await updateBookingStatus(id, status);
            }}>
              <SelectField
                label="Update Status"
                name="status"
                defaultValue={b.status}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "deposit_paid", label: "Deposit Paid" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <button
                type="submit"
                className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Update Status
              </button>
            </form>
          </Card>

          {b.stripe_session_id && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <dl className="space-y-3">
                <InfoItem label="Stripe Session" value={b.stripe_session_id} />
                <InfoItem label="Payment Intent" value={b.stripe_payment_intent} />
              </dl>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground mt-0.5">{value ?? "—"}</dd>
    </div>
  );
}
