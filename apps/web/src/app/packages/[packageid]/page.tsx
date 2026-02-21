import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity.client'
import { packageBySlugQuery } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.image'
import styles from '@/styles/sections/Sections.module.scss'

type PackagePageData = {
    title?: string
    slug?: { current?: string }
    priceLabel?: string
    price?: number
    depositPercent?: number
    summary?: string
    description?: string
    bulletPoints?: string[]
    idealFor?: string[]
    image?: { asset?: { _ref: string }; alt?: string }
    ctaText?: string
    ctaLink?: string
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ packageid: string }>
}): Promise<Metadata> {
    const { packageid } = await params
    const pkg = await client.fetch<PackagePageData | null>(packageBySlugQuery, { packageid })

    return {
        title: pkg?.title || 'Package Details',
        description: pkg?.summary || undefined,
    }
}

export default async function PackageDetailPage({
    params,
}: {
    params: Promise<{ packageid: string }>
}) {
    const { packageid } = await params
    const pkg = await client.fetch<PackagePageData | null>(packageBySlugQuery, { packageid })

    if (!pkg) {
        notFound()
    }

    return (
        <main>
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        {pkg.priceLabel && <span className={styles.sectionTag}>{pkg.priceLabel}</span>}
                        {pkg.title && <h1 className={styles.heading}>{pkg.title}</h1>}
                        {pkg.summary && <p className={styles.subheading}>{pkg.summary}</p>}
                    </div>

                    {pkg.image?.asset && (
                        <Image
                            src={urlFor(pkg.image).width(1400).height(900).url()}
                            alt={pkg.image.alt ?? pkg.title ?? 'Package image'}
                            width={1400}
                            height={900}
                            className={styles.projectImg}
                            style={{ borderRadius: '1rem', marginBottom: '2rem' }}
                        />
                    )}

                    <div className={styles.textContentWrap}>
                        {pkg.description && <p className={styles.body}>{pkg.description}</p>}

                        <div className={styles.metaInfoGrid}>
                            {pkg.bulletPoints && pkg.bulletPoints.length > 0 && (
                                <div className={styles.bulletPointsSection}>
                                    <h4>What is Included</h4>
                                    <ul className={styles.bulletList}>
                                        {pkg.bulletPoints.map((item, i) => (
                                            <li key={`package-bullet-${i}`}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {pkg.idealFor && pkg.idealFor.length > 0 && (
                                <div className={styles.idealForSection}>
                                    <h4>Ideal For</h4>
                                    <ul className={styles.bulletList}>
                                        {pkg.idealFor.map((item, i) => (
                                            <li key={`package-idealfor-${i}`}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className={styles.btnGroup}>
                            <a
                                href={
                                    pkg.price
                                        ? `/book/${pkg.slug?.current || packageid}`
                                        : pkg.ctaLink || '/contact'
                                }
                                className={styles.btnPrimary}
                            >
                                {pkg.ctaText || 'Book This Package'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
