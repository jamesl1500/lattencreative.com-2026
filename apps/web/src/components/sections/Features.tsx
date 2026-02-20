import styles from '@/styles/sections/Sections.module.scss'

type FeatureItem = {
    title?: string
    description?: string
    icon?: string
}

type FeaturesProps = {
    title?: string
    subtitle?: string
    items?: FeatureItem[]
    columns?: 2 | 3 | 4
    [key: string]: unknown
}

const iconMap: Record<string, string> = {
    palette: '🎨',
    code: '💻',
    megaphone: '📣',
    rocket: '🚀',
    shield: '🛡️',
    sparkles: '✨',
    chart: '📈',
    globe: '🌐',
    zap: '⚡',
    heart: '❤️',
    star: '⭐',
    lock: '🔒',
}

export default function Features(props: FeaturesProps) {
    const { title, subtitle, items = [], columns = 3 } = props

    const gridClass =
        columns === 4 ? styles.grid4 :
        columns === 2 ? styles.grid2 :
        styles.grid3

    return (
        <section className={styles.sectionAlt}>
            <div className={styles.container}>
                {(title || subtitle) && (
                    <div className={styles.sectionHeader}>
                        {title && <h2 className={styles.heading}>{title}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={gridClass}>
                    {items.map((item, i) => (
                        <article key={`feature-${i}`} className={styles.card}>
                            {item.icon && (
                                <div className={styles.cardIcon}>
                                    {iconMap[item.icon] ?? '✦'}
                                </div>
                            )}
                            {item.title && <h3 className={styles.cardTitle}>{item.title}</h3>}
                            {item.description && <p className={styles.cardBody}>{item.description}</p>}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
