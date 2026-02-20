/**
 * Sanity Schema: Contact Section
 * ----
 * A page section with contact information and optional form toggle.
 *
 * @module @latten/studio/schemaTypes/contactSection
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'contactSection',
    title: 'Contact Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({
            name: 'showForm',
            title: 'Show Contact Form',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'email',
            title: 'Email Override',
            type: 'string',
            description: 'If empty, uses the global contact email from Site Settings.',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Contact Section' }
        },
    },
})
