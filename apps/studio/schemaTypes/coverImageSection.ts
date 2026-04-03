import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'coverImageSection',
    title: 'Cover Image',
    type: 'object',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'string',
            description: 'Optional caption displayed below the image.',
        }),
        defineField({
            name: 'height',
            title: 'Height',
            type: 'string',
            options: {
                list: [
                    { title: 'Small (300px)', value: 'small' },
                    { title: 'Medium (480px)', value: 'medium' },
                    { title: 'Large (640px)', value: 'large' },
                    { title: 'Full Viewport', value: 'full' },
                ],
                layout: 'radio',
            },
            initialValue: 'medium',
        }),
        defineField({
            name: 'overlay',
            title: 'Overlay',
            type: 'boolean',
            description: 'Add a subtle dark gradient overlay for contrast.',
            initialValue: false,
        }),
    ],
    preview: {
        select: { title: 'caption', media: 'image' },
        prepare({ title, media }) {
            return {
                title: title || 'Cover Image',
                media,
            }
        },
    },
})
