import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type PackageRef = {
    _id: string
    title?: string
    priceLabel?: string
    summary?: string
    image?: { asset: { _ref: string }; alt?: string }
    slug?: { current: string }
}

type PackagesSectionProps = {
    headline?: string
    subtitle?: string
    packages?: PackageRef[]
    [key: string]: unknown
}

export default function PackagesSection(props: PackagesSectionProps) {
    const { headline, subtitle, packages = [] } = props

    if (!headline && !subtitle && packages.length === 0) {
        return null
    }

    return (
        <section className={styles.sectionAlt}>
            <div className={styles.container}>
                {(headline || subtitle) && (
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>Packages</span>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.grid3}>
                    {packages.map((pkg) => (
                        <Link
                            key={pkg._id}
                            href={`/packages/${pkg.slug?.current ?? ''}`}
                            className={styles.projectCard}
                        >
                            {pkg.image?.asset && (
                                <Image
                                    src={urlFor(pkg.image).width(800).height(500).url()}
                                    alt={pkg.image.alt ?? pkg.title ?? ''}
                                    width={800}
                                    height={500}
                                    className={styles.projectImg}
                                />
                            )}
                            <div className={styles.projectInfo}>
                                {pkg.priceLabel && <div className={styles.projectClient}>{pkg.priceLabel}</div>}
                                {pkg.title && <h3 className={styles.projectTitle}>{pkg.title}</h3>}
                                {pkg.summary && <p className={styles.projectExcerpt}>{pkg.summary}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
