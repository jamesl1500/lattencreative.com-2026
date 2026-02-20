/**
 * Sanity Schema: Testimonials
 * ----
 * Defines the schema for a "Testimonials" content block in Sanity CMS. This schema includes fields for the section title and an array of individual testimonials, each with its own quote, author name, and author title. It also includes validation rules to ensure data integrity.
 * 
 * @module @latten/studio/schemaTypes/testimonials
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'testimonials',
    title: 'Testimonials Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({
            name: 'items',
            title: 'Testimonials',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
                        defineField({ name: 'role', title: 'Role / Title', type: 'string' }),
                        defineField({ name: 'company', title: 'Company', type: 'string' }),
                        defineField({ name: 'quote', title: 'Quote', type: 'text', validation: (r) => r.required() }),
                        defineField({
                            name: 'photo',
                            title: 'Photo',
                            type: 'image',
                            options: { hotspot: true },
                            fields: [
                                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                            ],
                        }),
                    ],
                    preview: {
                        select: { title: 'name', subtitle: 'company', media: 'photo' },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Testimonials Section' }
        },
    },
})