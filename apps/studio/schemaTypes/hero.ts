/**
 * Sanity Schema: Hero
 * ----
 * Defines the schema for a "Hero" content block in Sanity CMS. This schema includes fields for the hero title, subtitle, background image, and call-to-action button. It also includes validation rules to ensure data integrity.
 * 
 * @module @latten/studio/schemaTypes/hero
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'hero',
    title: 'Hero Section',
    type: 'object',
    fields: [
        defineField({ name: 'structure', title: 'Structure', type: 'string', options: { list: ['default', 'split', 'centered'], layout: 'radio' }, initialValue: 'default' }),
        defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'subheadline', title: 'Sub-headline', type: 'text', rows: 2 }),
        defineField({ name: 'text', title: 'Body Text', type: 'text', rows: 4 }),
        defineField({
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            ],
        }),
        defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
        defineField({ name: 'ctaLink', title: 'CTA Button Link', type: 'string' }),
        defineField({ name: 'secondaryCtaText', title: 'Secondary CTA Text', type: 'string' }),
        defineField({ name: 'secondaryCtaLink', title: 'Secondary CTA Link', type: 'string' }),
        defineField({
            name: 'alignment',
            title: 'Text Alignment',
            type: 'string',
            options: { list: ['left', 'center', 'right'], layout: 'radio' },
            initialValue: 'center',
        }),
        defineField({
            name: 'overlay',
            title: 'Overlay Color',
            type: 'object',
            fields: [
                defineField({ name: 'color', title: 'Color', type: 'string', description: 'Hex code or CSS color name' }),
                defineField({ name: 'opacity', title: 'Opacity', type: 'number', options: { range: true, min: 0, max: 1, step: 0.1 }, initialValue: 0.5 }),
            ],
        }),
        defineField({
            name: 'height',
            title: 'Height',
            type: 'string',
            options: { list: ['small', 'medium', 'large', 'extra-large', 'cover'], layout: 'radio' },
            initialValue: 'medium',
        }),
    ],
    preview: {
        select: { title: 'headline' },
        prepare({ title }) {
            return { title: title || 'Hero Section' }
        },
    },
})