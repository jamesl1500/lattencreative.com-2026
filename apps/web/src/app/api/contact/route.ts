/**
 * POST /api/contact
 * ----
 * Saves a contact form submission to Supabase.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('contacts')
            .insert({ name, email, subject: subject || null, message })

        if (error) {
            console.error('[contact] Supabase insert error:', error)
            return NextResponse.json(
                { error: 'Failed to save message.' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (err) {
        console.error('[contact] Unexpected error:', err)
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        )
    }
}
