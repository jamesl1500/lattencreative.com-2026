/**
 * Sanity Client
 * ----
 * Initializes the Sanity client for fetching data from the Sanity CMS. This client is used throughout the application to interact with the Sanity API.
 * 
 * @module @latten/web/sanity.client
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-02-01',
    useCdn: true,
});