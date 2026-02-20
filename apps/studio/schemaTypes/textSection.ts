import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'textSection',
    title: 'Text Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'paragraph', title: 'Paragraph', type: 'text', rows: 5 }),
        defineField({
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            options: {
                list: [
                    { title: 'White', value: 'white' },
                    { title: 'Light Gray', value: 'lightGray' },
                    { title: 'Dark Gray', value: 'darkGray' },
                    { title: 'Primary Color', value: 'primary' },
                ],
                layout: 'radio',
            },
            initialValue: 'white',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Text Section' }
        },
    },
})