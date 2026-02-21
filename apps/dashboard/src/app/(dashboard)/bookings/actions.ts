"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "booking",
    entity_id: id,
    action: `Booking status changed to "${status.replace(/_/g, " ")}"`,
  });

  revalidatePath("/bookings");
  revalidatePath(`/bookings/${id}`);
}

export async function deleteBooking(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    entity_type: "booking",
    entity_id: id,
    action: "Booking deleted",
  });

  revalidatePath("/bookings");
  redirect("/bookings");
}

export async function convertBookingToClient(bookingId: string) {
  const supabase = await createClient();

  // Get booking data
  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (fetchErr || !booking) throw new Error("Booking not found");

  // Check if already converted
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("booking_id", bookingId)
    .single();

  if (existing) {
    redirect(`/clients/${existing.id}`);
  }

  // Create client from booking data
  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .insert({
      name: `${booking.customer_name}`,
      email: booking.customer_email,
      phone: booking.customer_phone,
      company: booking.company_name,
      status: "active",
      source: "booking",
      booking_id: bookingId,
    })
    .select()
    .single();

  if (clientErr || !client) throw new Error(clientErr?.message ?? "Failed to create client");

  // If booking had a package, create a project too
  if (booking.package_title) {
    const { data: project } = await supabase
      .from("projects")
      .insert({
        title: booking.package_title,
        description: booking.project_description,
        client_id: client.id,
        booking_id: bookingId,
        status: "planning",
        budget: booking.package_price,
      })
      .select()
      .single();

    if (project) {
      await supabase.from("activity_log").insert({
        entity_type: "project",
        entity_id: project.id,
        action: `Project "${booking.package_title}" created from booking`,
      });
    }
  }

  // Update booking status
  await supabase
    .from("bookings")
    .update({ status: "confirmed", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  await supabase.from("activity_log").insert({
    entity_type: "client",
    entity_id: client.id,
    action: `Client "${client.name}" created from booking`,
    details: `Email: ${client.email}`,
  });

  revalidatePath("/bookings");
  revalidatePath("/clients");
  revalidatePath("/projects");
  redirect(`/clients/${client.id}`);
}
