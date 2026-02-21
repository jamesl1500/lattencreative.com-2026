/**
 * Stripe Server Client
 * ----
 * Server-side Stripe instance for API routes.
 *
 * @module @latten/web/stripe
 * @author Latten Creative
 * @license MIT
 */
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
})
