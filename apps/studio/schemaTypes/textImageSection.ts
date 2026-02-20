import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'textImageSection',
    title: 'Text + Image Section',
    type: 'object',
    fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'paragraph', title: 'Paragraph', type: 'text', rows: 5 }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        }),
        defineField({
            name: 'imagePosition',
            title: 'Image Position',
            type: 'string',
            options: { list: ['left', 'right'], layout: 'radio' },
            initialValue: 'right',
        }),
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
            return { title: title || 'Text + Image Section' }
        },
    },
})