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
    packageSlug: string
    packageTitle: string
    packagePrice: number      // in cents
    depositAmount: number     // in cents
    preferredDate: string     // ISO date string
    preferredTime: string     // e.g. "10:00 AM"
    timezone: string
    projectDescription: string
    projectGoals?: string
    currentWebsite?: string
}

export async function POST(req: NextRequest) {
    try {
        const body: BookingPayload = await req.json()

        // Basic validation
        if (!body.customerName || !body.customerEmail || !body.packageSlug || !body.preferredDate || !body.preferredTime) {
            return NextResponse.json(
                { error: 'Missing required fields: customerName, customerEmail, packageSlug, preferredDate, preferredTime' },
                { status: 400 }
            )
        }

        if (!body.packagePrice || body.packagePrice <= 0) {
            return NextResponse.json(
                { error: 'Invalid package price' },
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
                package_slug: body.packageSlug,
                package_title: body.packageTitle,
                package_price: body.packagePrice,
                deposit_amount: body.depositAmount,
                preferred_date: body.preferredDate,
                preferred_time: body.preferredTime,
                timezone: body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
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
