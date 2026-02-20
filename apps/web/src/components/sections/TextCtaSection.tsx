import styles from '@/styles/sections/Sections.module.scss'

type TextCtaSectionProps = {
    headline?: string
    paragraph?: string
    primaryCtaText?: string
    primaryCtaLink?: string
    secondaryCtaText?: string
    secondaryCtaLink?: string
    backgroundColor?: 'white' | 'lightGray' | 'darkGray' | 'primary'
    [key: string]: unknown
}

export default function TextCtaSection(props: TextCtaSectionProps) {
    const {
        headline,
        paragraph,
        primaryCtaText,
        primaryCtaLink = '#',
        secondaryCtaText,
        secondaryCtaLink = '#',
        backgroundColor = 'white',
    } = props

    const backgroundClassMap = {
        white: styles.bgWhite,
        lightGray: styles.bgLightGray,
        darkGray: styles.bgDarkGray,
        primary: styles.bgPrimary,
    } as const

    const backgroundClass = backgroundClassMap[backgroundColor] ?? styles.bgWhite

    if (!headline && !paragraph && !primaryCtaText && !secondaryCtaText) {
        return null
    }

    return (
        <section className={`${styles.sectionAlt} ${backgroundClass}`}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    {headline && <h2 className={styles.heading}>{headline}</h2>}
                    {paragraph && <p className={styles.body}>{paragraph}</p>}

                    {(primaryCtaText || secondaryCtaText) && (
                        <div className={styles.btnGroup}>
                            {primaryCtaText && (
                                <a href={primaryCtaLink} className={styles.btnPrimary}>
                                    {primaryCtaText}
                                </a>
                            )}
                            {secondaryCtaText && (
                                <a href={secondaryCtaLink} className={styles.btnSecondary}>
                                    {secondaryCtaText}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
