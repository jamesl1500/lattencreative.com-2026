/**
 * Sanity Schema: Blog Section
 * ----
 * Embeddable section object that renders a grid of blog posts
 * on any CMS-managed page.
 *
 * @module @latten/studio/schemaTypes/blogSection
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'blogSection',
    title: 'Blog Section',
    type: 'object',
    fields: [
        defineField({
            name: 'tag',
            title: 'Tag Label',
            type: 'string',
            initialValue: 'Blog',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Latest Insights',
        }),
        defineField({
            name: 'subheading',
            title: 'Subheading',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'limit',
            title: 'Number of Posts',
            type: 'number',
            initialValue: 6,
            validation: (rule) => rule.min(1).max(12),
            description: 'How many posts to show. Leave empty to show all.',
        }),
        defineField({
            name: 'showTags',
            title: 'Show Tag Filters',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'string',
            initialValue: 'View All Posts',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'string',
            initialValue: '/blog',
        }),
    ],
    preview: {
        select: { title: 'heading' },
        prepare({ title }) {
            return { title: title || 'Blog Section', subtitle: 'Blog grid' }
        },
    },
})
