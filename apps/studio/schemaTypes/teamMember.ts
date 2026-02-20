/**
 * Sanity Schema: Team Member
 * ----
 * People who work at the studio.
 *
 * @module @latten/studio/schemaTypes/teamMember
 * @author Latten Creative
 * @license MIT
 */
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'teamMember',
    title: 'Team Member',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role / Title',
            type: 'string',
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
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
                                    { title: 'LinkedIn', value: 'linkedin' },
                                    { title: 'GitHub', value: 'github' },
                                    { title: 'Dribbble', value: 'dribbble' },
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
            name: 'order',
            title: 'Sort Order',
            type: 'number',
        }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'name', subtitle: 'role', media: 'photo' },
    },
})
