import styles from '@/styles/sections/Sections.module.scss'

type StatItem = {
    value?: string
    label?: string
}

type StatsSectionProps = {
    headline?: string
    items?: StatItem[]
    [key: string]: unknown
}

export default function StatsSection(props: StatsSectionProps) {
    const { headline, items = [] } = props

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {headline && (
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.heading}>{headline}</h2>
                    </div>
                )}

                <div className={styles.statsGrid}>
                    {items.map((item, i) => (
                        <div key={`stat-${i}`}>
                            {item.value && <div className={styles.statValue}>{item.value}</div>}
                            {item.label && <div className={styles.statLabel}>{item.label}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
