import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'package',
    title: 'Package',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Package ID (Slug)',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
            description: 'Used in the URL, e.g. /packages/starter-web-package',
        }),
        defineField({
            name: 'priceLabel',
            title: 'Price Label',
            type: 'string',
            description: 'Display text, e.g. "$1,500" or "Starting at $2,500"',
        }),
        defineField({
            name: 'price',
            title: 'Price (cents)',
            type: 'number',
            description: 'The actual price in cents. E.g. 150000 = $1,500.00',
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: 'depositPercent',
            title: 'Deposit %',
            type: 'number',
            description: 'Percentage of price required as deposit (default 50)',
            initialValue: 50,
            validation: (rule) => rule.min(1).max(100),
        }),
        defineField({
            name: 'summary',
            title: 'Summary',
            type: 'text',
            rows: 3,
            description: 'Short description used on package cards.',
        }),
        defineField({
            name: 'description',
            title: 'Full Description',
            type: 'text',
            rows: 8,
            description: 'Main content shown on the package detail page.',
        }),
        defineField({
            name: 'bulletPoints',
            title: 'What is Included',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'idealFor',
            title: 'Ideal For',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Describe the ideal client or project for this package.',
        }),
        defineField({
            name: 'image',
            title: 'Featured Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'string',
            initialValue: 'Book This Package',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Button Link',
            type: 'string',
            description: 'Optional custom link for checkout/contact. Defaults to /contact if left empty.',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'priceLabel',
            media: 'image',
        },
    },
})
