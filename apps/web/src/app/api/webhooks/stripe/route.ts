/**
 * POST /api/webhooks/stripe
 * ----
 * Handles Stripe webhook events.
 * Updates booking status when deposit payment is confirmed.
 */
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('[webhook] Signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session

            const bookingId = session.metadata?.booking_id
            if (!bookingId) {
                console.warn('[webhook] No booking_id in session metadata')
                break
            }

            const { error } = await supabase
                .from('bookings')
                .update({
                    status: 'deposit_paid',
                    deposit_paid: true,
                    deposit_paid_at: new Date().toISOString(),
                    stripe_payment_intent_id: session.payment_intent as string,
                })
                .eq('id', bookingId)

            if (error) {
                console.error('[webhook] Failed to update booking:', error)
                return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
            }

            console.log(`[webhook] Booking ${bookingId} marked as deposit_paid`)
            break
        }

        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session
            const bookingId = session.metadata?.booking_id

            if (bookingId) {
                await supabase
                    .from('bookings')
                    .update({ status: 'pending' })
                    .eq('id', bookingId)

                console.log(`[webhook] Booking ${bookingId} checkout expired, reverted to pending`)
            }
            break
        }

        default:
            console.log(`[webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
