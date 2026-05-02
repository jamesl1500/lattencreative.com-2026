/**
 * POST /api/bookings
 * ----
 * Creates a new booking in Supabase.
 * Expects JSON body with customer + project details.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface BookingPayload {
    customerName: string
    customerEmail: string
    customerPhone?: string
    companyName?: string
    packageId: string
    calendlyEventUri: string  // e.g. https://api.calendly.com/scheduled_events/UUID
    calendlyInviteeUri: string
    projectDescription: string
    projectGoals?: string
    currentWebsite?: string
}

export async function POST(req: NextRequest) {
    try {
        const body: BookingPayload = await req.json()

        // Basic validation
        if (!body.customerName || !body.customerEmail || !body.packageId || !body.calendlyEventUri) {
            return NextResponse.json(
                { error: 'Missing required fields: customerName, customerEmail, packageId, calendlyEventUri' },
                { status: 400 }
            )
        }

        // Resolve package and derive authoritative pricing details.
        const { data: pkgRow, error: pkgError } = await supabase
            .from('packages')
            .select('id, slug, title, price_exact, price_min, deposit_percent, is_active')
            .eq('id', body.packageId)
            .eq('is_active', true)
            .single()

        if (pkgError || !pkgRow) {
            return NextResponse.json(
                { error: 'Invalid package selection' },
                { status: 400 }
            )
        }

        const packagePrice = pkgRow.price_exact ?? pkgRow.price_min ?? 0
        const depositPercent = Number(pkgRow.deposit_percent || 50)
        const depositAmount = Math.round(packagePrice * (depositPercent / 100))

        if (packagePrice <= 0 || depositPercent <= 0 || depositPercent > 100 || depositAmount <= 0) {
            return NextResponse.json(
                { error: 'Selected package is not currently bookable' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert({
                customer_name: body.customerName,
                customer_email: body.customerEmail,
                customer_phone: body.customerPhone || null,
                company_name: body.companyName || null,
                package_id: pkgRow.id,
                package_slug: pkgRow.slug,
                package_title: pkgRow.title,
                package_price: packagePrice,
                deposit_amount: depositAmount,
                calendly_event_uri: body.calendlyEventUri,
                calendly_invitee_uri: body.calendlyInviteeUri || null,
                project_description: body.projectDescription,
                project_goals: body.projectGoals || null,
                current_website: body.currentWebsite || null,
                status: 'pending',
                deposit_paid: false,
            })
            .select('id')
            .single()

        if (error) {
            console.error('[bookings] Supabase insert error:', error)
            return NextResponse.json(
                { error: 'Failed to create booking' },
                { status: 500 }
            )
        }

        return NextResponse.json({ bookingId: data.id }, { status: 201 })
    } catch (err) {
        console.error('[bookings] Unexpected error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
