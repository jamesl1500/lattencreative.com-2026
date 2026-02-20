/**
 * Stripe client instance for server-side usage.
 * ----
 * This file initializes the Stripe client using the secret key from environment variables.
 * It exports the initialized Stripe client instance, which can be imported and used in other parts of the application to interact with the Stripe API.
 * Make sure to set the STRIPE_SECRET_KEY environment variable before using this module, as it is required for authentication with the Stripe API.
 * 
 * @module @latten/lib/stripe
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});