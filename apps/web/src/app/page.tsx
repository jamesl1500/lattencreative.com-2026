/**
 * Homepage
 * ----
 * Fetches the "home" page from Sanity and renders all sections,
 * or shows a default hero if no CMS page exists yet.
 *
 * @module @latten/web/page
 * @author Latten Creative
 * @license MIT
 */
import { client } from '@/lib/sanity.client'
import { pageBySlugQuery, featuredProjectsQuery, allServicesQuery, allTeamQuery, siteSettingsQuery } from '@/lib/sanity.queries'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import CTA from '@/components/sections/CTA'
import Testimonials from '@/components/sections/Testimonials'
import ServicesSection from '@/components/sections/ServicesSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TeamSection from '@/components/sections/TeamSection'
import StatsSection from '@/components/sections/StatsSection'
import ContactSection from '@/components/sections/ContactSection'

type PageSection = {
    _type: string
    _key?: string
    [key: string]: unknown
}

type SanityPage = {
    title?: string
    content?: PageSection[]
}

function renderSection(section: PageSection, i: number) {
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
        default:
            return null
    }
}

export default async function Home() {
    const page = await client.fetch<SanityPage | null>(pageBySlugQuery, { slug: 'home' })

    /* If a "home" page exists in Sanity, render its sections */
    if (page?.content?.length) {
        return <main>{page.content.map(renderSection)}</main>
    }

    /* Fallback: build a default homepage from individual queries */
    const [services, projects, team, siteContent] = await Promise.all([
        client.fetch(allServicesQuery),
        client.fetch(featuredProjectsQuery),
        client.fetch(allTeamQuery),
        client.fetch(siteSettingsQuery),
    ])

    return (
        <main>
            <Hero
                headline="We Design Digital Experiences That Matter"
                subheadline="Latten Creative is a boutique web design studio crafting modern, high-performance websites and brands that connect."
                ctaText="Start a Project"
                ctaLink="#contact"
                secondaryCtaText="View Our Work"
                secondaryCtaLink="#projects"
                alignment="center"
                backgroundImage={{
                    asset: { _ref: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
                    alt: 'Creative workspace with laptop and design sketches',
                }}
            />
            <StatsSection
                headline="Proven Results"
                items={[
                    { value: '120+', label: 'Projects Delivered' },
                    { value: '98%', label: 'Client Satisfaction' },
                    { value: '8+', label: 'Years of Experience' },
                    { value: '40+', label: 'Happy Clients' },
                ]}
            />

            <ServicesSection
                headline="What We Do"
                subtitle="End-to-end creative services to bring your vision to life."
                services={services}
            />

            <ProjectsSection
                headline="Featured Work"
                subtitle="A selection of recent projects we are proud of."
                projects={projects}
            />

            <TeamSection
                headline="Meet the Team"
                subtitle="The talented people behind every project."
                members={team}
            />

            <CTA
                headline="Ready to Elevate Your Brand?"
                subtitle="Let's collaborate to create something extraordinary."
                buttonText="Get in Touch"
                buttonLink="#contact"
                style="accent"
            />

            <ContactSection
                headline="Start a Conversation"
                subtitle="Tell us about your project and we'll get back to you within 24 hours."
                showForm={true}
                email={siteContent?.contactEmail}
                phone={siteContent?.contactPhone}
                address={siteContent?.address}
            />
        </main>
    )
}
