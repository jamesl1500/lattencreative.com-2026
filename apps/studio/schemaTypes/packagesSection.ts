import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'packagesSection',
    title: 'Packages Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
        defineField({
            name: 'packages',
            title: 'Packages to Display',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'package' }] }],
            description: 'Select one or more packages to show in this section.',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Packages Section' }
        },
    },
})
