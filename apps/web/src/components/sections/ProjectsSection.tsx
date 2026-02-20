import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type ProjectRef = {
    _id: string
    title?: string
    client?: string
    excerpt?: string
    thumbnail?: { asset: { _ref: string }; alt?: string }
    slug?: { current: string }
}

type ProjectsSectionProps = {
    headline?: string
    subtitle?: string
    projects?: ProjectRef[]
    [key: string]: unknown
}

export default function ProjectsSection(props: ProjectsSectionProps) {
    const { headline, subtitle, projects = [] } = props

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {(headline || subtitle) && (
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>Our Work</span>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.grid2}>
                    {projects.map((p) => (
                        <Link
                            key={p._id}
                            href={`/projects/${p.slug?.current ?? ''}`}
                            className={styles.projectCard}
                        >
                            {p.thumbnail?.asset && (
                                <Image
                                    src={urlFor(p.thumbnail).width(800).height(500).url()}
                                    alt={p.thumbnail.alt ?? p.title ?? ''}
                                    width={800}
                                    height={500}
                                    className={styles.projectImg}
                                />
                            )}
                            <div className={styles.projectInfo}>
                                {p.client && <div className={styles.projectClient}>{p.client}</div>}
                                {p.title && <h3 className={styles.projectTitle}>{p.title}</h3>}
                                {p.excerpt && <p className={styles.projectExcerpt}>{p.excerpt}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
