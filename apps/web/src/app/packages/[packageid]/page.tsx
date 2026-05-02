import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_LABELS, getBookingPrice, getPackageById } from '@/lib/packages'
import styles from '@/styles/PackagesModern.module.scss'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ packageid: string }>
}): Promise<Metadata> {
    const { packageid } = await params
    const pkg = await getPackageById(packageid)

    return {
        title: pkg?.title ?? 'Package Details',
        description: pkg?.summary ?? undefined,
    }
}

export default async function PackageDetailPage({
    params,
}: {
    params: Promise<{ packageid: string }>
}) {
    const { packageid } = await params
    const pkg = await getPackageById(packageid)

    if (!pkg) {
        notFound()
    }

    const bookingPrice = getBookingPrice(pkg)

    return (
        <main className={styles.page}>
            <div className={styles.glowA} />
            <div className={styles.glowB} />
            <section className={styles.container}>
                <Link href="/packages" className={styles.back}>
                    <span aria-hidden="true">&larr;</span> Back to Packages
                </Link>

                <div className={styles.hero}>
                    <span className={styles.kicker}>{CATEGORY_LABELS[pkg.category]}</span>
                    <h1>{pkg.title}</h1>
                    {pkg.tagline && <p>{pkg.tagline}</p>}
                    {pkg.summary && <p>{pkg.summary}</p>}
                </div>

                <div className={styles.detailWrap}>
                    <article className={styles.panel}>
                        <span className={styles.pricePill}>{pkg.price_label}</span>
                        {pkg.description && <p className={styles.summary}>{pkg.description}</p>}
                        {pkg.cta_copy && <p className={styles.ctaCopy}>{pkg.cta_copy}</p>}

                        <div className={styles.actions}>
                            <Link
                                href={bookingPrice > 0 ? `/book/${pkg.id}` : '/contact'}
                                className={styles.primaryBtn}
                            >
                                {pkg.cta_button_text || 'Book This Package'}
                            </Link>
                            <Link href="/contact" className={styles.secondaryBtn}>
                                Ask A Question
                            </Link>
                        </div>
                    </article>

                    <aside className={styles.metaGrid}>
                        {pkg.features && pkg.features.length > 0 && (
                            <section className={styles.metaBlock}>
                                <h4>What Is Included</h4>
                                <ul>
                                    {pkg.features.map((item, i) => (
                                        <li key={`package-bullet-${i}`}>{item}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {pkg.ideal_for && pkg.ideal_for.length > 0 && (
                            <section className={styles.metaBlock}>
                                <h4>Ideal For</h4>
                                <ul>
                                    {pkg.ideal_for.map((item, i) => (
                                        <li key={`package-idealfor-${i}`}>{item}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className={styles.metaBlock}>
                            <h4>Deposit</h4>
                            <p>{pkg.deposit_percent}% due at booking</p>
                        </section>
                    </aside>
                </div>
            </section>
        </main>
    )
}
