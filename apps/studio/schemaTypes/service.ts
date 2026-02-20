/**
 * Sanity Schema: Service
 * ----
 * A portfolio service offered by the studio (e.g. Web Design, Branding, etc.)
 *
 * @module @latten/studio/schemaTypes/service
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            description: 'Appears on cards and listings.',
        }),
        defineField({
            name: 'description',
            title: 'Full Description',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'icon',
            title: 'Icon Name',
            type: 'string',
            description: 'An icon identifier (e.g. "palette", "code", "megaphone"). Used to render an SVG icon on the frontend.',
        }),
        defineField({
            name: 'image',
            title: 'Featured Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'order',
            title: 'Sort Order',
            type: 'number',
            description: 'Lower numbers appear first.',
        }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'title', subtitle: 'shortDescription', media: 'image' },
    },
})
