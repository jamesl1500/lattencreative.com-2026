import Image from 'next/image'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type TestimonialItem = {
    name?: string
    role?: string
    company?: string
    quote?: string
    photo?: { asset: { _ref: string }; alt?: string }
}

type TestimonialsProps = {
    headline?: string
    subtitle?: string
    items?: TestimonialItem[]
    [key: string]: unknown
}

export default function Testimonials(props: TestimonialsProps) {
    const { headline, subtitle, items = [] } = props

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {(headline || subtitle) && (
                    <div className={styles.sectionHeader}>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.grid3}>
                    {items.map((t, i) => (
                        <article key={`testimonial-${i}`} className={styles.testimonialCard}>
                            {t.quote && <p className={styles.quote}>{t.quote}</p>}
                            <div className={styles.testimonialAuthor}>
                                {t.photo?.asset && (
                                    <Image
                                        src={urlFor(t.photo).width(80).height(80).url()}
                                        alt={t.photo.alt ?? t.name ?? ''}
                                        width={40}
                                        height={40}
                                        className={styles.authorPhoto}
                                    />
                                )}
                                <div>
                                    {t.name && <div className={styles.authorName}>{t.name}</div>}
                                    {(t.role || t.company) && (
                                        <div className={styles.authorMeta}>
                                            {[t.role, t.company].filter(Boolean).join(' \u00b7 ')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
