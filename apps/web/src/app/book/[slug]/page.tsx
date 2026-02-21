/**
 * /book/[slug] — Booking Flow
 * ----
 * Server component that fetches the package from Sanity,
 * then renders the client-side multi-step BookingForm.
 */
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import BookingForm from '@/components/BookingForm'

const bookingPackageQuery = groq`
    *[_type == "package" && slug.current == $slug][0]{
        title,
        slug,
        price,
        depositPercent,
        priceLabel,
        summary,
    }
`

interface BookingPackage {
    title: string
    slug: { current: string }
    price: number
    depositPercent: number
    priceLabel?: string
    summary?: string
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const pkg = await client.fetch<BookingPackage | null>(bookingPackageQuery, { slug })

    return {
        title: pkg ? `Book ${pkg.title}` : 'Book a Package',
        description: pkg?.summary || 'Schedule a meeting and lock in your project with a deposit.',
    }
}

export default async function BookingPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const pkg = await client.fetch<BookingPackage | null>(bookingPackageQuery, { slug })

    if (!pkg || !pkg.price) {
        notFound()
    }

    // Default deposit to 50% if not set
    const packageData = {
        ...pkg,
        depositPercent: pkg.depositPercent || 50,
    }

    return <BookingForm pkg={packageData} />
}
