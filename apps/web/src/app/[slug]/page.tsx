/**
 * Dynamic Page Component
 * ----
 * Renders a page based on the slug from Sanity CMS.
 *
 * @module @latten/web/[slug]
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import type { Metadata } from 'next'
import { client } from '@/lib/sanity.client'
import { pageBySlugQuery } from '@/lib/sanity.queries'
import { notFound } from 'next/navigation'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import CTA from '@/components/sections/CTA'
import Testimonials from '@/components/sections/Testimonials'
import ServicesSection from '@/components/sections/ServicesSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TeamSection from '@/components/sections/TeamSection'
import StatsSection from '@/components/sections/StatsSection'
import ContactSection from '@/components/sections/ContactSection'
import TextSection from '@/components/sections/TextSection'
import TextListSection from '@/components/sections/TextListSection'
import TextImageSection from '@/components/sections/TextImageSection'
import TextCtaSection from '@/components/sections/TextCtaSection'
import PackagesSection from '@/components/sections/PackagesSection'

type PageSection = {
    _type: string
    _key?: string
    [key: string]: unknown
}

type DynamicPage = {
    title?: string
    seo?: { title?: string; description?: string }
    content?: PageSection[]
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const page = await client.fetch<DynamicPage | null>(pageBySlugQuery, { slug })

    return {
        title: page?.seo?.title || page?.title || slug,
        description: page?.seo?.description || undefined,
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const page = await client.fetch<DynamicPage>(pageBySlugQuery, { slug })

    if (!page) {
        notFound()
    }

    return (
        <main>
            {page?.content?.map((section: PageSection, i: number) => {
                const key = section._key ?? `${section._type}-${i}`
                switch (section._type) {
                    case 'hero':
                        return <Hero key={key} {...section} />
                    case 'features':
                        return <Features key={key} {...section} />
                    case 'cta':
                        return <CTA key={key} {...section} />
                    case 'testimonials':
                        return <Testimonials key={key} {...section} />
                    case 'servicesSection':
                        return <ServicesSection key={key} {...section} />
                    case 'projectsSection':
                        return <ProjectsSection key={key} {...section} />
                    case 'teamSection':
                        return <TeamSection key={key} {...section} />
                    case 'statsSection':
                        return <StatsSection key={key} {...section} />
                    case 'contactSection':
                        return <ContactSection key={key} {...section} />
                    case 'textSection':
                        return <TextSection key={key} {...section} />
                    case 'textListSection':
                        return <TextListSection key={key} {...section} />
                    case 'textImageSection':
                        return <TextImageSection key={key} {...section} />
                    case 'textCtaSection':
                        return <TextCtaSection key={key} {...section} />
                    case 'packagesSection':
                        return <PackagesSection key={key} {...section} />
                    default:
                        return null
                }
            })}
        </main>
    )
}