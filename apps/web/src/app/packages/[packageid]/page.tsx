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
    summary?: string
    description?: string
    bulletPoints?: string[]
    image?: { asset?: { _ref: string }; alt?: string }
    ctaText?: string
    ctaLink?: string
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

                        {pkg.bulletPoints && pkg.bulletPoints.length > 0 && (
                            <ul className={styles.bulletList}>
                                {pkg.bulletPoints.map((item, i) => (
                                    <li key={`package-bullet-${i}`}>{item}</li>
                                ))}
                            </ul>
                        )}

                        <div className={styles.btnGroup}>
                            <a href={pkg.ctaLink || '/contact'} className={styles.btnPrimary}>
                                {pkg.ctaText || 'Book This Package'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
