/**
 * Sanity Schema: Stats Section
 * ----
 * A page section for showing key numbers / stats (projects completed, years, etc.)
 *
 * @module @latten/studio/schemaTypes/statsSection
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'statsSection',
    title: 'Stats Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({
            name: 'items',
            title: 'Stats',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "150+", "99%"' }),
                        defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Projects Delivered"' }),
                    ],
                    preview: {
                        select: { title: 'value', subtitle: 'label' },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Stats Section' }
        },
    },
})
