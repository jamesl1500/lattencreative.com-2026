/**
 * Sanity Schema: Projects Section
 * ----
 * A page section that showcases selected portfolio projects.
 *
 * @module @latten/studio/schemaTypes/projectsSection
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'projectsSection',
    title: 'Projects Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({
            name: 'projects',
            title: 'Projects to Display',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'project' }] }],
            description: 'Leave empty to show featured projects.',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Projects Section' }
        },
    },
})
