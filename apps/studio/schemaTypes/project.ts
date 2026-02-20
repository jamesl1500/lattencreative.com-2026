/**
 * Sanity Schema: Project (Portfolio)
 * ----
 * A case study / portfolio piece showcasing client work.
 *
 * @module @latten/studio/schemaTypes/project
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
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
            name: 'client',
            title: 'Client Name',
            type: 'string',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'body',
            title: 'Case Study Body',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'images',
            title: 'Gallery Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'services',
            title: 'Services Used',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'service' }] }],
        }),
        defineField({
            name: 'url',
            title: 'Live URL',
            type: 'url',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
            description: 'Show on the homepage featured projects section.',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
        }),
    ],
    orderings: [
        { title: 'Published', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    ],
    preview: {
        select: { title: 'title', subtitle: 'client', media: 'thumbnail' },
    },
})
