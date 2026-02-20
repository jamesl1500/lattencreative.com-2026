import styles from '@/styles/sections/Sections.module.scss'

type TextSectionProps = {
    headline?: string
    paragraph?: string
    [key: string]: unknown
}

export default function TextSection(props: TextSectionProps) {
    const { headline, paragraph } = props

    if (!headline && !paragraph) {
        return null
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    {headline && <h2 className={styles.heading}>{headline}</h2>}
                    {paragraph && <p className={styles.body}>{paragraph}</p>}
                </div>
            </div>
        </section>
    )
}
