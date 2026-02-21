/**
 * POST /api/checkout
 * ----
 * Creates a Stripe Checkout Session for the booking deposit.
 * Expects JSON body with { bookingId }.
 * Returns the Stripe Checkout URL for redirect.
 */
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json()

        if (!bookingId) {
            return NextResponse.json(
                { error: 'Missing bookingId' },
                { status: 400 }
            )
        }

        // Fetch the booking from Supabase
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

        if (fetchError || !booking) {
            console.error('[checkout] Booking fetch error:', fetchError)
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            )
        }

        if (booking.deposit_paid) {
            return NextResponse.json(
                { error: 'Deposit already paid for this booking' },
                { status: 400 }
            )
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: booking.customer_email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${booking.package_title} — 50% Deposit`,
                            description: `Deposit to secure your ${booking.package_title} project with Latten Creative. Meeting scheduled for ${booking.preferred_date} at ${booking.preferred_time}.`,
                        },
                        unit_amount: booking.deposit_amount, // already in cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                booking_id: bookingId,
                package_slug: booking.package_slug,
            },
            success_url: `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
            cancel_url: `${appUrl}/book/cancelled?booking_id=${bookingId}`,
        })

        // Update booking with Stripe session ID
        await supabase
            .from('bookings')
            .update({
                stripe_checkout_session_id: session.id,
                status: 'confirmed',
            })
            .eq('id', bookingId)

        return NextResponse.json({ url: session.url }, { status: 200 })
    } catch (err) {
        console.error('[checkout] Unexpected error:', err)
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}
