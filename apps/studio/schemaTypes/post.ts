/**
 * Sanity Schema: Blog Post
 * ----
 * Blog / insights articles for the studio.
 *
 * @module @latten/studio/schemaTypes/post
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Blog Post',
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
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'teamMember' }],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),
    ],
    orderings: [
        { title: 'Published', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    ],
    preview: {
        select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
    },
})
