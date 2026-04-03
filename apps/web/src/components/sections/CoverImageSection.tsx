import Image from 'next/image'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type CoverImageSectionProps = {
    image?: { asset?: { _ref: string }; alt?: string }
    caption?: string
    height?: 'small' | 'medium' | 'large' | 'full'
    overlay?: boolean
    [key: string]: unknown
}

const heightMap: Record<string, string> = {
    small: 'coverImageSmall',
    medium: 'coverImageMedium',
    large: 'coverImageLarge',
    full: 'coverImageFull',
}

export default function CoverImageSection(props: CoverImageSectionProps) {
    const { image, caption, height = 'medium', overlay = false } = props

    if (!image?.asset) return null

    const heightClass = styles[heightMap[height] ?? 'coverImageMedium']

    return (
        <section className={`${styles.coverImage} ${heightClass}`}>
            <div className={styles.coverImageInner}>
                <Image
                    src={urlFor(image).width(1920).quality(85).url()}
                    alt={image.alt ?? ''}
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                {overlay && <div className={styles.coverImageOverlay} />}
                {caption && (
                    <div className={styles.coverImageCaption}>{caption}</div>
                )}
            </div>
        </section>
    )
}
