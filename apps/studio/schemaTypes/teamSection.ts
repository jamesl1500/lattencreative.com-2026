/**
 * Sanity Schema: Team Section
 * ----
 * A page section that showcases team members.
 *
 * @module @latten/studio/schemaTypes/teamSection
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'teamSection',
    title: 'Team Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({
            name: 'members',
            title: 'Team Members to Display',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
            description: 'Leave empty to show all team members.',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Team Section' }
        },
    },
})
