/**
 * /blog — Blog Listing Page
 * ----
 * Shows all published blog posts in a responsive grid.
 * First post is featured (spans full width).
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { allPostsQuery } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.image'
import styles from '@/styles/sections/Blog.module.scss'

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Insights, tutorials, and behind-the-scenes from the Latten Creative team.',
}

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

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default async function BlogPage() {
    const posts = await client.fetch<Post[]>(allPostsQuery)

    return (
        <main className={styles.blogPage}>
            <div className={styles.blogContainer}>
                {/* Header */}
                <div className={styles.blogHeader}>
                    <span className={styles.blogTag}>Blog</span>
                    <h1 className={styles.blogHeading}>Insights & Ideas</h1>
                    <p className={styles.blogSubheading}>
                        Thoughts on design, development, and building products that people love.
                    </p>
                </div>

                {/* Post Grid */}
                {posts && posts.length > 0 ? (
                    <div className={styles.postGrid}>
                        {posts.map((post, i) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug.current}`}
                                className={`${styles.postCard} ${i === 0 ? styles.postFeatured : ''}`}
                            >
                                {/* Cover Image */}
                                <div className={styles.postCardImage}>
                                    {post.coverImage?.asset ? (
                                        <Image
                                            src={urlFor(post.coverImage)
                                                .width(i === 0 ? 1200 : 800)
                                                .height(i === 0 ? 700 : 500)
                                                .url()}
                                            alt={post.coverImage.alt ?? post.title}
                                            width={i === 0 ? 1200 : 800}
                                            height={i === 0 ? 700 : 500}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#f3f4f6' }} />
                                    )}
                                </div>

                                {/* Body */}
                                <div className={styles.postCardBody}>
                                    {/* Meta */}
                                    <div className={styles.postCardMeta}>
                                        <span className={styles.postCardDate}>
                                            {formatDate(post.publishedAt)}
                                        </span>
                                        {post.author && (
                                            <span className={styles.postCardAuthor}>
                                                {post.author.photo?.asset && (
                                                    <Image
                                                        src={urlFor(post.author.photo).width(40).height(40).url()}
                                                        alt={post.author.name}
                                                        width={20}
                                                        height={20}
                                                        className={styles.postCardAuthorAvatar}
                                                    />
                                                )}
                                                {post.author.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className={styles.postCardTags}>
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className={styles.postCardTag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h2 className={styles.postCardTitle}>{post.title}</h2>

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className={styles.postCardExcerpt}>{post.excerpt}</p>
                                    )}

                                    {/* Read More */}
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
                    <div className={styles.postGrid}>
                        <div className={styles.blogEmpty}>
                            <div className={styles.blogEmptyIcon}>📝</div>
                            <p className={styles.blogEmptyText}>
                                No posts yet. Check back soon!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
