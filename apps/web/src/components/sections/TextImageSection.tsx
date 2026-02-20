import Image from 'next/image'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type SectionImage = {
    asset?: { _ref: string }
    alt?: string
}

type TextImageSectionProps = {
    headline?: string
    paragraph?: string
    image?: SectionImage
    imagePosition?: 'left' | 'right'
    [key: string]: unknown
}

export default function TextImageSection(props: TextImageSectionProps) {
    const { headline, paragraph, image, imagePosition = 'right' } = props

    if (!headline && !paragraph && !image?.asset) {
        return null
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div
                    className={`${styles.textImageGrid} ${
                        imagePosition === 'left' ? styles.imageLeft : styles.imageRight
                    }`}
                >
                    <div className={styles.textContentWrap}>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {paragraph && <p className={styles.body}>{paragraph}</p>}
                    </div>

                    {image?.asset && (
                        <div className={styles.textImageMedia}>
                            <Image
                                src={urlFor(image).width(1200).height(900).url()}
                                alt={image.alt ?? headline ?? 'Section image'}
                                width={1200}
                                height={900}
                                className={styles.textImage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
