/**
 * Sanity Schema: Services Section
 * ----
 * A page section that showcases selected services.
 *
 * @module @latten/studio/schemaTypes/servicesSection
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'servicesSection',
    title: 'Services Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({
            name: 'services',
            title: 'Services to Display',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'service' }] }],
            description: 'Leave empty to show all services.',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Services Section' }
        },
    },
})
