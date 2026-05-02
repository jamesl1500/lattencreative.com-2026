export type NavItem = { label: string; href: string }
export type SocialItem = { platform: string; url: string }

export type ServiceItem = {
    id: string
    title: string
    summary: string
    deliverables: string[]
}

export const siteConfig = {
    siteName: 'Latten Creative',
    description: 'High-performance websites, conversion-focused systems, and growth campaigns for modern brands.',
    footerText: 'We build conversion systems that look premium, load fast, and turn traffic into pipeline.',
    contactEmail: 'jlatten@lattencreative.com',
    contactPhone: '(216) 889-7822',
    address: 'Lorain, Ohio',
    nav: [
        { label: 'Services', href: '/services' },
        { label: 'Packages', href: '/packages' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ] satisfies NavItem[],
    ctaButton: { label: 'Book Discovery', href: '/packages' },
    socialLinks: [
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/96225287' },
    ] satisfies SocialItem[],
}

export const homeStats = [
    { label: 'Avg. Lighthouse Score', value: '95+' },
    { label: 'Median Load Time', value: '< 1.5s' },
    { label: 'Client Retention', value: '90%' },
    { label: 'Projects Delivered', value: '120+' },
]

export const services: ServiceItem[] = [
    {
        id: 'brand-sites',
        title: 'Brand Websites',
        summary: 'Narrative-driven marketing sites that position your company as the obvious choice.',
        deliverables: ['Messaging architecture', 'High-fidelity UI system', 'Next.js build + deployment'],
    },
    {
        id: 'conversion-systems',
        title: 'Conversion Systems',
        summary: 'Landing pages, offer flows, and lifecycle touchpoints designed to increase qualified leads.',
        deliverables: ['Offer framing', 'Lead-gen funnels', 'A/B testing roadmap'],
    },
    {
        id: 'retainers',
        title: 'Growth Retainers',
        summary: 'Ongoing optimization across SEO, CRO, and campaign creative for compounding growth.',
        deliverables: ['Monthly experiments', 'Performance reporting', 'Priority creative support'],
    },
]

export const processSteps = [
    {
        title: 'Strategy Sprint',
        description: 'We map goals, audience, offer, and positioning before design starts.',
    },
    {
        title: 'Design + Build',
        description: 'We design an interface system and implement it with a fast, scalable codebase.',
    },
    {
        title: 'Launch + Iterate',
        description: 'We launch with analytics, then improve conversion and performance in cycles.',
    },
]

export const team = [
    {
        name: 'James Latten',
        role: 'Founder, Creative Director',
        bio: 'Leads strategy, UX direction, and brand narrative for every engagement.',
    },
    {
        name: 'Delivery Team',
        role: 'Design + Engineering',
        bio: 'A focused network of specialists assembled to match each project scope.',
    },
]
