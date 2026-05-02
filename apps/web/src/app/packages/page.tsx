import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPackages, CATEGORY_LABELS, getBookingPrice } from '@/lib/packages'
import type { SupabasePackage } from '@/lib/packages'
import styles from '@/styles/PackagesModern.module.scss'

export const metadata: Metadata = {
    title: 'Packages & Pricing',
    description: 'Explore our website, bundle, maintenance, and marketing packages.',
}

const CATEGORY_ORDER: SupabasePackage['category'][] = [
    'website',
    'bundle',
    'maintenance',
    'marketing',
]

export default async function PackagesPage() {
    const packages = await getAllPackages()
    const hasPackages = packages.length > 0

    // Group by category preserving display order
    const grouped = CATEGORY_ORDER.reduce<Record<string, SupabasePackage[]>>(
        (acc, cat) => {
            acc[cat] = packages.filter((p) => p.category === cat)
            return acc
        },
        {} as Record<string, SupabasePackage[]>
    )

    return (
        <main className={styles.page}>
            <div className={styles.glowA} />
            <div className={styles.glowB} />
            <section className={styles.container}>
                <div className={styles.hero}>
                    <span className={styles.kicker}>Packages</span>
                    <h1>Pick Your Growth System.</h1>
                    <p>
                            Everything you need to build, grow, and maintain your digital presence —
                            from a first website to a full marketing engine.
                    </p>
                </div>

                {!hasPackages && (
                    <div className={styles.empty}>
                        <h2>Packages are temporarily unavailable</h2>
                        <p>
                            We could not load package data right now. Please try again in a few minutes,
                            or contact us and we can help you directly.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/contact" className={styles.primaryBtn}>Contact Us</Link>
                        </div>
                    </div>
                )}

                {CATEGORY_ORDER.map((category) => {
                    const items = grouped[category]
                    if (!items || items.length === 0) return null

                    return (
                        <div key={category} className={styles.category}>
                            <h2 className={styles.categoryTitle}>{CATEGORY_LABELS[category]}</h2>
                            <div className={styles.grid}>
                                {items.map((pkg) => {
                                    const bookingPrice = getBookingPrice(pkg)
                                    return (
                                        <article key={pkg.id} className={styles.card}>
                                            <span className={styles.pricePill}>{pkg.price_label}</span>
                                            <h3>{pkg.title}</h3>
                                            {pkg.tagline && <p className={styles.tagline}>{pkg.tagline}</p>}
                                            {pkg.summary && <p className={styles.summary}>{pkg.summary}</p>}
                                            <div className={styles.actions}>
                                                <Link href={`/packages/${pkg.id}`} className={styles.secondaryBtn}>
                                                    Learn More
                                                </Link>
                                                <Link
                                                    href={bookingPrice > 0 ? `/book/${pkg.id}` : '/contact'}
                                                    className={styles.primaryBtn}
                                                >
                                                    {pkg.cta_button_text || 'Get Started'}
                                                </Link>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </section>
        </main>
    )
}
