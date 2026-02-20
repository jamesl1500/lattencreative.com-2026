/**
 * Sanity Image URL Builder
 * ----
 * Provides a helper to generate optimised image URLs from Sanity asset references.
 *
 * @module @latten/web/sanity.image
 * @author Latten Creative
 * @license MIT
 */
import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
    return builder.image(source)
}
