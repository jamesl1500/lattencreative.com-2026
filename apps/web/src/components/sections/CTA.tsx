import styles from '@/styles/sections/Sections.module.scss'

type CTAProps = {
    headline?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    style?: 'default' | 'accent' | 'dark'
    [key: string]: unknown
}

export default function CTA(props: CTAProps) {
    const {
        headline,
        subtitle,
        buttonText = 'Get Started',
        buttonLink = '#',
        style: ctaStyle = 'default',
    } = props

    const variantClass =
        ctaStyle === 'accent' ? `${styles.ctaBanner} ${styles.ctaAccent}` :
        ctaStyle === 'dark'   ? `${styles.ctaBanner} ${styles.ctaDark}` :
        styles.ctaBanner

    return (
        <section className={variantClass}>
            <div className={styles.container}>
                {headline && <h2 className={styles.heading}>{headline}</h2>}
                {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                <a href={buttonLink} className={styles.btnPrimary}>
                    {buttonText}
                </a>
            </div>
        </section>
    )
}
