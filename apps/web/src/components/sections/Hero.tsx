import Image from 'next/image'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type HeroProps = {
    structure?: 'default' | 'split' | 'centered'
    headline?: string
    subheadline?: string
    text?: string
    backgroundImage?: { asset: { _ref: string }; alt?: string }
    ctaText?: string
    ctaLink?: string
    secondaryCtaText?: string
    secondaryCtaLink?: string
    alignment?: 'left' | 'center' | 'right'
    height?: 'small' | 'medium' | 'large' | 'extra-large' | 'cover'
    overlay?: { color?: string; opacity?: number }
    [key: string]: unknown
}

/* Map Sanity height values → SCSS class names */
const heightMap: Record<string, string> = {
    small: 'heroSmall',
    medium: 'heroMedium',
    large: 'heroLarge',
    'extra-large': 'heroExtraLarge',
    cover: 'heroCover',
}

/* Map Sanity structure values → SCSS class names */
const structureMap: Record<string, string> = {
    default: 'heroDefault',
    split: 'heroSplit',
    centered: 'heroCentered',
}

export default function Hero(props: HeroProps) {
    const {
        structure = 'default',
        headline,
        subheadline,
        text,
        backgroundImage,
        ctaText,
        ctaLink,
        secondaryCtaText,
        secondaryCtaLink,
        alignment = 'center',
        height = 'medium',
        overlay,
    } = props

    const classes = [
        styles.hero,
        styles[heightMap[height] ?? 'heroMedium'],
        styles[structureMap[structure] ?? 'heroDefault'],
        alignment === 'left' ? styles.heroLeft : '',
        alignment === 'right' ? styles.heroRight : '',
    ].filter(Boolean).join(' ')

    const hasImageUrl = backgroundImage?.asset?._ref?.startsWith('http')

    const overlayStyle = overlay?.color
        ? { background: overlay.color, opacity: overlay.opacity ?? 0.5 }
        : undefined

    return (
        <section className={classes}>
            {backgroundImage?.asset && (
                <div className={styles.heroBg}>
                    <Image
                        src={
                            hasImageUrl
                                ? backgroundImage.asset._ref
                                : urlFor(backgroundImage).width(1920).quality(80).url()
                        }
                        alt={backgroundImage.alt ?? ''}
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                    />
                    {overlayStyle && (
                        <div className={styles.heroOverlay} style={overlayStyle} />
                    )}
                </div>
            )}

            <div className={styles.heroContent}>
                {headline && <h1 className={styles.headingLg}>{headline}</h1>}
                {subheadline && <p className={styles.subheading}>{subheadline}</p>}
                {text && <p className={styles.body}>{text}</p>}

                <div className={styles.btnGroup}>
                    {ctaText && (
                        <a href={ctaLink ?? '#'} className={styles.btnPrimary}>
                            {ctaText}
                        </a>
                    )}
                    {secondaryCtaText && (
                        <a href={secondaryCtaLink ?? '#'} className={styles.btnSecondary}>
                            {secondaryCtaText}
                        </a>
                    )}
                </div>
            </div>

            {/* Split layout: image on the right side */}
            {structure === 'split' && backgroundImage?.asset && (
                <div className={styles.heroSplitImage}>
                    <Image
                        src={
                            hasImageUrl
                                ? backgroundImage.asset._ref
                                : urlFor(backgroundImage).width(800).height(600).quality(80).url()
                        }
                        alt={backgroundImage.alt ?? ''}
                        width={800}
                        height={600}
                        style={{ objectFit: 'cover', borderRadius: '1.25rem', width: '100%', height: 'auto' }}
                    />
                </div>
            )}
        </section>
    )
}
