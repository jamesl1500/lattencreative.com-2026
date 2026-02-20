import styles from '@/styles/sections/Sections.module.scss'

type TextListSectionProps = {
    headline?: string
    paragraph?: string
    bulletPoints?: string[]
    [key: string]: unknown
}

export default function TextListSection(props: TextListSectionProps) {
    const { headline, paragraph, bulletPoints = [] } = props

    if (!headline && !paragraph && bulletPoints.length === 0) {
        return null
    }

    return (
        <section className={styles.sectionAlt}>
            <div className={styles.container}>
                <div className={styles.textContentWrap}>
                    {headline && <h2 className={styles.heading}>{headline}</h2>}
                    {paragraph && <p className={styles.body}>{paragraph}</p>}
                    {bulletPoints.length > 0 && (
                        <ul className={styles.bulletList}>
                            {bulletPoints.map((item, i) => (
                                <li key={`bullet-${i}`}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    )
}
