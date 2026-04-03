/**
 * /projects/[slug] — Project Detail (Case Study)
 * ----
 * Renders a full project page with hero image, case study body,
 * service tags, image gallery, and live URL link.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { client } from '@/lib/sanity.client'
import { projectBySlugQuery } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.image'
import styles from '@/styles/sections/Projects.module.scss'

/* ── Types ── */
type ProjectDetail = {
    title: string
    slug: { current: string }
    client?: string
    excerpt?: string
    body?: PortableTextBlock[]
    thumbnail?: { asset?: { _ref: string }; alt?: string }
    images?: { asset?: { _ref: string }; alt?: string }[]
    services?: { _id: string; title: string; slug?: { current: string }; icon?: string }[]
    url?: string
    featured?: boolean
    publishedAt?: string
}

/* ── Helpers ── */
function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })
}

/* ── Portable Text Overrides ── */
const ptComponents: PortableTextComponents = {
    types: {
        image: ({ value }: { value: { asset?: { _ref: string }; alt?: string; caption?: string } }) => {
            if (!value?.asset) return null
            return (
                <figure>
                    <Image
                        src={urlFor(value).width(1200).url()}
                        alt={value.alt || ''}
                        width={1200}
                        height={675}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '0.875rem',
                            border: '1px solid rgba(0,0,0,0.06)',
                            margin: '2rem 0',
                        }}
                    />
                    {value.caption && (
                        <figcaption className={styles.imageCaption}>
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            )
        },
    },
    block: {
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <h3>{children}</h3>,
        h4: ({ children }) => <h4>{children}</h4>,
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    marks: {
        link: ({ children, value }) => (
            <a href={value?.href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
    },
}

/* ── Metadata ── */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, { slug })

    return {
        title: project?.title || 'Project',
        description: project?.excerpt || undefined,
    }
}

/* ── Page ── */
export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, { slug })

    if (!project) {
        notFound()
    }

    return (
        <main className={styles.projectPage}>
            <div className={styles.projectContainer}>
                {/* Back link */}
                <Link href="/" className={styles.backLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </Link>

                {/* Header */}
                <header className={styles.header}>
                    {project.client && (
                        <div className={styles.client}>{project.client}</div>
                    )}

                    <h1 className={styles.title}>{project.title}</h1>

                    {project.excerpt && (
                        <p className={styles.excerpt}>{project.excerpt}</p>
                    )}

                    <div className={styles.meta}>
                        {project.publishedAt && (
                            <span className={styles.date}>
                                {formatDate(project.publishedAt)}
                            </span>
                        )}

                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.liveLink}
                            >
                                Visit Live Site
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        )}
                    </div>
                </header>

                {/* Thumbnail / Hero */}
                {project.thumbnail?.asset && (
                    <div className={styles.thumbnail}>
                        <Image
                            src={urlFor(project.thumbnail).width(1400).height(788).url()}
                            alt={project.thumbnail.alt ?? project.title}
                            width={1400}
                            height={788}
                            priority
                        />
                    </div>
                )}

                {/* Services */}
                {project.services && project.services.length > 0 && (
                    <div className={styles.services}>
                        {project.services.map((service) => (
                            <span key={service._id} className={styles.serviceTag}>
                                {service.title}
                            </span>
                        ))}
                    </div>
                )}

                {/* Case Study Body */}
                {project.body && (
                    <div className={styles.body}>
                        <PortableText value={project.body} components={ptComponents} />
                    </div>
                )}

                {/* Image Gallery */}
                {project.images && project.images.length > 0 && (
                    <section className={styles.gallery}>
                        <h2 className={styles.galleryHeading}>Gallery</h2>
                        <div className={styles.galleryGrid}>
                            {project.images.map((img, i) => (
                                img.asset && (
                                    <div key={i} className={styles.galleryImage}>
                                        <Image
                                            src={urlFor(img).width(600).height(450).url()}
                                            alt={img.alt || `${project.title} screenshot ${i + 1}`}
                                            width={600}
                                            height={450}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <div className={styles.cta}>
                    <p className={styles.ctaText}>
                        Interested in a similar project?
                    </p>
                    <Link href="/packages" className={styles.ctaButton}>
                        Start a Project
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>
            </div>
        </main>
    )
}
