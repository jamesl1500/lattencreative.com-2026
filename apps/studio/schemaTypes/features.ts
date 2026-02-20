/**
 * Sanity Schema: Features
 * ----
 * Defines the schema for a "Features" content block in Sanity CMS. This schema includes fields for the section title and an array of individual features, each with its own title and description. It also includes validation rules to ensure data integrity.
 * 
 * @module @latten/studio/schemaTypes/features
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'features',
    title: 'Features Section',
    type: 'object',
    fields: [
        defineField({ name: 'title', title: 'Section Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({
            name: 'items',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
                        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                        defineField({ name: 'icon', title: 'Icon Name', type: 'string', description: 'e.g. "sparkles", "rocket", "shield"' }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'description' },
                    },
                },
            ],
        }),
        defineField({
            name: 'columns',
            title: 'Columns',
            type: 'number',
            options: { list: [2, 3, 4] },
            initialValue: 3,
        }),
    ],
    preview: {
        select: { title: 'title' },
        prepare({ title }) {
            return { title: title || 'Features Section' }
        },
    },
})