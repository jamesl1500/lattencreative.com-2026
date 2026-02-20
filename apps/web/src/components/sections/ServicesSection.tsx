import Image from 'next/image'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type ServiceRef = {
    _id: string
    title?: string
    shortDescription?: string
    icon?: string
    image?: { asset: { _ref: string }; alt?: string }
    slug?: { current: string }
}

type ServicesSectionProps = {
    headline?: string
    subtitle?: string
    services?: ServiceRef[]
    [key: string]: unknown
}

const iconMap: Record<string, string> = {
    palette: '🎨',
    code: '💻',
    megaphone: '📣',
    rocket: '🚀',
    sparkles: '✨',
    globe: '🌐',
    zap: '⚡',
    shield: '🛡️',
}

export default function ServicesSection(props: ServicesSectionProps) {
    const { headline, subtitle, services = [] } = props

    return (
        <section className={styles.sectionAlt}>
            <div className={styles.container}>
                {(headline || subtitle) && (
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>What We Do</span>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.grid3}>
                    {services.map((s) => (
                        <article key={s._id} className={styles.card}>
                            {s.icon && (
                                <div className={styles.cardIcon}>
                                    {iconMap[s.icon] ?? '✦'}
                                </div>
                            )}
                            {s.image?.asset && !s.icon && (
                                <Image
                                    src={urlFor(s.image).width(400).height(240).url()}
                                    alt={s.image.alt ?? s.title ?? ''}
                                    width={400}
                                    height={240}
                                    style={{ borderRadius: '0.5rem', marginBottom: '1rem', width: '100%', height: 'auto' }}
                                />
                            )}
                            {s.title && <h3 className={styles.cardTitle}>{s.title}</h3>}
                            {s.shortDescription && <p className={styles.cardBody}>{s.shortDescription}</p>}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
