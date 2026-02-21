/**
 * /blog/[slug] — Blog Post Detail
 * ----
 * Renders a full blog article with Portable Text body,
 * author info, cover image, and tags.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { client } from '@/lib/sanity.client'
import { postBySlugQuery } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.image'
import styles from '@/styles/sections/Blog.module.scss'

type PostDetail = {
    title: string
    slug: { current: string }
    excerpt?: string
    body?: unknown[]
    coverImage?: { asset?: { _ref: string }; alt?: string }
    publishedAt: string
    tags?: string[]
    author?: {
        name: string
        role?: string
        photo?: { asset?: { _ref: string } }
        bio?: string
    }
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })
}

/* Portable Text component overrides */
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
                        <figcaption className={styles.articleImageCaption}>
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

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const post = await client.fetch<PostDetail | null>(postBySlugQuery, { slug })

    return {
        title: post?.title || 'Blog Post',
        description: post?.excerpt || undefined,
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = await client.fetch<PostDetail | null>(postBySlugQuery, { slug })

    if (!post) {
        notFound()
    }

    return (
        <main className={styles.articlePage}>
            <article className={styles.articleContainer}>
                {/* Back link */}
                <Link href="/blog" className={styles.articleBackLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    All Posts
                </Link>

                {/* Header */}
                <header className={styles.articleHeader}>
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className={styles.articleTags}>
                            {post.tags.map((tag) => (
                                <span key={tag} className={styles.articleTag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className={styles.articleTitle}>{post.title}</h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className={styles.articleExcerpt}>{post.excerpt}</p>
                    )}

                    {/* Meta: Author + Date */}
                    <div className={styles.articleMeta}>
                        {post.author && (
                            <div className={styles.articleAuthor}>
                                {post.author.photo?.asset && (
                                    <Image
                                        src={urlFor(post.author.photo).width(80).height(80).url()}
                                        alt={post.author.name}
                                        width={36}
                                        height={36}
                                        className={styles.articleAuthorAvatar}
                                    />
                                )}
                                <div>
                                    <div className={styles.articleAuthorName}>
                                        {post.author.name}
                                    </div>
                                    {post.author.role && (
                                        <div className={styles.articleAuthorRole}>
                                            {post.author.role}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {post.author && post.publishedAt && (
                            <span className={styles.articleDivider}>·</span>
                        )}
                        {post.publishedAt && (
                            <span className={styles.articleDate}>
                                {formatDate(post.publishedAt)}
                            </span>
                        )}
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage?.asset && (
                    <div className={styles.articleCover}>
                        <Image
                            src={urlFor(post.coverImage).width(1400).height(788).url()}
                            alt={post.coverImage.alt ?? post.title}
                            width={1400}
                            height={788}
                            priority
                        />
                    </div>
                )}

                {/* Body */}
                {post.body && (
                    <div className={styles.articleBody}>
                        <PortableText value={post.body} components={ptComponents} />
                    </div>
                )}
            </article>
        </main>
    )
}
