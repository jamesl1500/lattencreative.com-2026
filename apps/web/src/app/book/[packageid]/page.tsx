/**
 * /book/[packageid] — Booking Flow
 * ----
 * Server component that fetches the package by UUID,
 * then renders the client-side multi-step BookingForm.
 */
import { notFound } from 'next/navigation'
import { getPackageById, getBookingPrice } from '@/lib/packages'
import BookingForm from '@/components/BookingForm'

export async function generateMetadata({ params }: { params: Promise<{ packageid: string }> }) {
    const { packageid } = await params
    const pkg = await getPackageById(packageid)

    return {
        title: pkg ? `Book ${pkg.title}` : 'Book a Package',
        description: pkg?.summary ?? 'Schedule a meeting and lock in your project with a deposit.',
    }
}

export default async function BookingPage({
    params,
}: {
    params: Promise<{ packageid: string }>
}) {
    const { packageid } = await params
    console.log(`[BookingPage] Fetching package with id: ${packageid}`)
    const pkg = await getPackageById(packageid)

    if (!pkg) {
        console.log(`[BookingPage] Package ${packageid} not found.`)
        notFound()
    }

    const price = getBookingPrice(pkg)
    if (!price) {
        console.log(`[BookingPage] Package ${pkg.id} has no price set. Cannot proceed with booking flow.`)
        notFound()
    }

    const packageData = {
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        price,
        depositPercent: pkg.deposit_percent || 50,
        priceLabel: pkg.price_label,
        summary: pkg.summary ?? undefined,
    }

    return <BookingForm pkg={packageData} />
}
