/**
 * Sanity Schema: Site Settings (Singleton)
 * ----
 * Global settings for the website: logo, navigation links, footer text,
 * social media links, and contact information. Edited once, used everywhere.
 *
 * @module @latten/studio/schemaTypes/siteSettings
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'siteName',
            title: 'Site Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'logoDark',
            title: 'Logo (Dark Mode)',
            type: 'image',
            options: { hotspot: true },
            description: 'Optional logo for dark backgrounds. Falls back to the main logo.',
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'navigation',
            title: 'Main Navigation',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
                        defineField({ name: 'href', title: 'Link', type: 'string', validation: (r) => r.required() }),
                    ],
                    preview: {
                        select: { title: 'label', subtitle: 'href' },
                    },
                },
            ],
        }),
        defineField({
            name: 'ctaButton',
            title: 'Header CTA Button',
            type: 'object',
            fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'href', title: 'Link', type: 'string' }),
            ],
        }),
        defineField({
            name: 'footerText',
            title: 'Footer Text',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'platform',
                            title: 'Platform',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Twitter / X', value: 'twitter' },
                                    { title: 'Instagram', value: 'instagram' },
                                    { title: 'LinkedIn', value: 'linkedin' },
                                    { title: 'GitHub', value: 'github' },
                                    { title: 'Dribbble', value: 'dribbble' },
                                    { title: 'Behance', value: 'behance' },
                                    { title: 'YouTube', value: 'youtube' },
                                    { title: 'Facebook', value: 'facebook' },
                                ],
                            },
                        }),
                        defineField({ name: 'url', title: 'URL', type: 'url' }),
                    ],
                    preview: {
                        select: { title: 'platform', subtitle: 'url' },
                    },
                },
            ],
        }),
        defineField({
            name: 'contactEmail',
            title: 'Contact Email',
            type: 'string',
        }),
        defineField({
            name: 'contactPhone',
            title: 'Contact Phone',
            type: 'string',
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'text',
            rows: 3,
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Site Settings' }
        },
    },
})
