/**
 * Sanity Schema: CTA
 * ----
 * Defines the schema for a "Call to Action" (CTA) content block in Sanity CMS. This schema includes fields for the CTA title, description, button text, and button link. It also includes validation rules to ensure data integrity.
 * 
 * @module @latten/studio/schemaTypes/cta
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'cta',
    title: 'Call To Action',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
        defineField({ name: 'buttonLink', title: 'Button Link', type: 'string' }),
        defineField({
            name: 'style',
            title: 'Style',
            type: 'string',
            options: { list: ['default', 'accent', 'dark'], layout: 'radio' },
            initialValue: 'default',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'CTA Section' }
        },
    },
})