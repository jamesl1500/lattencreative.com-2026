/**
 * GROQ Queries
 * ----
 * Centralised GROQ queries for fetching Sanity data.
 *
 * @module @latten/web/sanity.queries
 * @author Latten Creative
 * @license MIT
 */
import { groq } from 'next-sanity'

/* ── Site Settings ── */
export const siteSettingsQuery = groq`
    *[_type == "siteSettings"][0]{
        siteName,
        logo,
        logoDark,
        navigation,
        ctaButton,
        footerText,
        socialLinks,
        contactEmail,
        contactPhone,
        address,
    }
`

/* ── Pages ── */
export const pageBySlugQuery = groq`
    *[_type == "page" && slug.current == $slug][0]{
        title,
        slug,
        content[]{
            ...,
            _type == "servicesSection" => {
                ...,
                services[]->{ _id, title, shortDescription, icon, image, slug }
            },
            _type == "projectsSection" => {
                ...,
                projects[]->{ _id, title, excerpt, thumbnail, slug, client }
            },
            _type == "teamSection" => {
                ...,
                members[]->{ _id, name, role, bio, photo }
            },
            _type == "packagesSection" => {
                ...,
                packages[]->{ _id, title, slug, priceLabel, summary, image }
            },
        },
        seo,
    }
`

/* ── Packages ── */
export const allPackagesQuery = groq`
    *[_type == "package"] | order(title asc){
        _id,
        title,
        slug,
        priceLabel,
        summary,
        image,
        ctaText,
        ctaLink,
    }
`

export const packageBySlugQuery = groq`
    *[_type == "package" && slug.current == $packageid][0]{
        _id,
        title,
        slug,
        priceLabel,
        price,
        depositPercent,
        summary,
        description,
        bulletPoints,
        idealFor,
        image,
        ctaText,
        ctaLink,
    }
`

/* ── Services ── */
export const allServicesQuery = groq`
    *[_type == "service"] | order(order asc){
        _id, title, slug, shortDescription, icon, image
    }
`

/* ── Projects ── */
export const allProjectsQuery = groq`
    *[_type == "project"] | order(publishedAt desc){
        _id, title, slug, client, excerpt, thumbnail, featured
    }
`

export const featuredProjectsQuery = groq`
    *[_type == "project" && featured == true] | order(publishedAt desc)[0...6]{
        _id, title, slug, client, excerpt, thumbnail
    }
`

/* ── Team ── */
export const allTeamQuery = groq`
    *[_type == "teamMember"] | order(order asc){
        _id, name, role, bio, photo, socialLinks
    }
`

/* ── Blog ── */
export const allPostsQuery = groq`
    *[_type == "post"] | order(publishedAt desc){
        _id, title, slug, excerpt, coverImage, publishedAt, tags,
        author->{ name, photo }
    }
`

export const postBySlugQuery = groq`
    *[_type == "post" && slug.current == $slug][0]{
        title, slug, excerpt, body, coverImage, publishedAt, tags,
        author->{ name, role, photo, bio }
    }
`
