/**
 * Sanity Schema: Page
 * ----
 * Defines the schema for a "Page" document in Sanity CMS. This schema includes fields for the page title, slug, content sections, and SEO metadata. It also includes validation rules to ensure data integrity.
 * 
 * @module @latten/studio/schemaTypes/page
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
export default {
    name: 'page',
    title: 'Page',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'content',
            title: 'Content Sections',
            type: 'array',
            of: [
                { type: 'hero' },
                { type: 'features' },
                { type: 'cta' },
                { type: 'testimonials' },
                { type: 'servicesSection' },
                { type: 'projectsSection' },
                { type: 'teamSection' },
                { type: 'statsSection' },
                { type: 'contactSection' },
                { type: 'textSection' },
                { type: 'textListSection' },
                { type: 'textImageSection' },
                { type: 'textCtaSection' },
                { type: 'packagesSection' },
            ],
        },
        {
            name: 'seo',
            title: 'SEO Metadata',
            type: 'object',
            fields: [
                {
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                },
                {
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                },
                {
                    name: 'metaImage',
                    title: 'Meta Image',
                    type: 'image',
                },
            ],
        },
    ],
}