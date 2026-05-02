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

        if (!booking.package_id) {
            return NextResponse.json(
                { error: 'Booking package is missing' },
                { status: 400 }
            )
        }

        // Re-fetch package to verify authoritative price/deposit data.
        const { data: pkg, error: pkgError } = await supabase
            .from('packages')
            .select('id, slug, title, price_exact, price_min, deposit_percent')
            .eq('id', booking.package_id)
            .single()

        if (pkgError || !pkg) {
            console.error('[checkout] Package fetch error:', pkgError)
            return NextResponse.json(
                { error: 'Package not found for this booking' },
                { status: 404 }
            )
        }

        const packagePrice = pkg.price_exact ?? pkg.price_min ?? 0
        const depositPercent = Number(pkg.deposit_percent || 50)
        const expectedDeposit = Math.round(packagePrice * (depositPercent / 100))

        if (packagePrice <= 0 || depositPercent <= 0 || depositPercent > 100 || expectedDeposit <= 0) {
            return NextResponse.json(
                { error: 'Package pricing is invalid' },
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
                            name: `${pkg.title} — ${depositPercent}% Deposit`,
                            description: `Deposit to secure your ${pkg.title} project with Latten Creative.`,
                        },
                        unit_amount: expectedDeposit,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                booking_id: bookingId,
                package_id: pkg.id,
                package_slug: pkg.slug,
            },
            success_url: `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
            cancel_url: `${appUrl}/book/cancelled?booking_id=${bookingId}`,
        })

        // Update booking with Stripe session ID
        await supabase
            .from('bookings')
            .update({
                package_slug: pkg.slug,
                package_title: pkg.title,
                package_price: packagePrice,
                deposit_amount: expectedDeposit,
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
