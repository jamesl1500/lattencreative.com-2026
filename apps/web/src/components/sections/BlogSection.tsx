/**
 * Blog Section Component
 * ----
 * Embeddable blog grid for CMS-managed pages.
 * Fetches recent posts from Sanity and renders a card grid.
 */
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { allPostsQuery } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.image'
import styles from '@/styles/sections/Blog.module.scss'

type Post = {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    coverImage?: { asset?: { _ref: string }; alt?: string }
    publishedAt: string
    tags?: string[]
    author?: { name: string; photo?: { asset?: { _ref: string } } }
}

interface BlogSectionProps {
    tag?: string
    heading?: string
    subheading?: string
    limit?: number
    ctaText?: string
    ctaLink?: string
    [key: string]: unknown
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default async function BlogSection({
    tag = 'Blog',
    heading = 'Latest Insights',
    subheading,
    limit = 6,
    ctaText = 'View All Posts',
    ctaLink = '/blog',
}: BlogSectionProps) {
    const allPosts = await client.fetch<Post[]>(allPostsQuery)
    const posts = limit ? allPosts.slice(0, limit) : allPosts

    return (
        <section className={styles.blogSection}>
            <div className={styles.blogContainer}>
                {/* Header */}
                <div className={styles.blogSectionHeader}>
                    {tag && <span className={styles.blogTag}>{tag}</span>}
                    {heading && <h2 className={styles.blogHeading}>{heading}</h2>}
                    {subheading && <p className={styles.blogSubheading}>{subheading}</p>}
                </div>

                {/* Grid */}
                {posts.length > 0 ? (
                    <div className={`${styles.postGrid} ${styles.blogSectionGrid}`}>
                        {posts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug.current}`}
                                className={styles.postCard}
                            >
                                <div className={styles.postCardImage}>
                                    {post.coverImage?.asset ? (
                                        <Image
                                            src={urlFor(post.coverImage).width(800).height(500).url()}
                                            alt={post.coverImage.alt ?? post.title}
                                            width={800}
                                            height={500}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#f3f4f6' }} />
                                    )}
                                </div>

                                <div className={styles.postCardBody}>
                                    <div className={styles.postCardMeta}>
                                        <span className={styles.postCardDate}>
                                            {formatDate(post.publishedAt)}
                                        </span>
                                        {post.author && (
                                            <span className={styles.postCardAuthor}>
                                                {post.author.name}
                                            </span>
                                        )}
                                    </div>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className={styles.postCardTags}>
                                            {post.tags.slice(0, 2).map((t) => (
                                                <span key={t} className={styles.postCardTag}>{t}</span>
                                            ))}
                                        </div>
                                    )}

                                    <h3 className={styles.postCardTitle}>{post.title}</h3>

                                    {post.excerpt && (
                                        <p className={styles.postCardExcerpt}>{post.excerpt}</p>
                                    )}

                                    <span className={styles.postCardReadMore}>
                                        Read more
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.blogEmpty}>
                        <p className={styles.blogEmptyText}>No posts published yet.</p>
                    </div>
                )}

                {/* CTA */}
                {ctaText && ctaLink && posts.length > 0 && (
                    <div className={styles.blogSectionCta}>
                        <Link href={ctaLink} className={styles.blogSectionCtaBtn}>
                            {ctaText}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
