/**
 * POST /api/webhooks/calendly
 * ----
 * Handles Calendly webhook events.
 * Syncs booking status when meetings are created, cancelled, or rescheduled.
 *
 * Set up in your Calendly dashboard:
 *   Organization Webhooks → URL: https://yourdomain.com/api/webhooks/calendly
 *   Events: invitee.created, invitee.canceled
 */
import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { supabase } from '@/lib/supabase'

function verifyCalendlySignature(body: string, signature: string | null): boolean {
    const secret = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
    if (!secret || !signature) return false

    const [, receivedHash] = signature.split('=')
    if (!receivedHash) return false

    const expectedHash = createHmac('sha256', secret)
        .update(body, 'utf8')
        .digest('hex')

    try {
        return timingSafeEqual(
            Buffer.from(receivedHash, 'hex'),
            Buffer.from(expectedHash, 'hex'),
        )
    } catch {
        return false
    }
}

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('calendly-webhook-signature')

    if (!verifyCalendlySignature(body, signature)) {
        console.warn('[webhooks/calendly] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    let payload: Record<string, unknown>
    try {
        payload = JSON.parse(body)
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const event = payload.event as string
    const eventData = payload.payload as Record<string, unknown>

    switch (event) {
        case 'invitee.created': {
            const eventUri = (eventData?.event as Record<string, unknown>)?.uri as string
            const inviteeUri = (eventData?.uri) as string
            const startTime = (eventData?.scheduled_event as Record<string, unknown>)?.start_time as string | undefined

            if (!eventUri) break

            // Find booking by calendly_event_uri and update with confirmed start time
            const { error } = await supabase
                .from('bookings')
                .update({
                    status: 'scheduled',
                    scheduled_at: startTime ?? null,
                })
                .eq('calendly_event_uri', eventUri)

            if (error) {
                console.error('[webhooks/calendly] Failed to update booking on invitee.created:', error)
            } else {
                console.log(`[webhooks/calendly] Booking confirmed for event ${eventUri}`)
            }
            break
        }

        case 'invitee.canceled': {
            const eventUri = (eventData?.event as Record<string, unknown>)?.uri as string

            if (!eventUri) break

            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('calendly_event_uri', eventUri)

            if (error) {
                console.error('[webhooks/calendly] Failed to cancel booking:', error)
            } else {
                console.log(`[webhooks/calendly] Booking cancelled for event ${eventUri}`)
            }
            break
        }

        default:
            console.log(`[webhooks/calendly] Unhandled event: ${event}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
