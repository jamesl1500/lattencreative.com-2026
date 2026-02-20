/**
 * @latten/lib entry point
 * This file re-exports all the modules from the src directory, making them available for import when the package is used.
 * This allows for cleaner imports in other parts of the application, as you can import directly from '@latten/lib' instead of specifying the path to each module.
 * For example, if you have a module named 'stripe.ts' in the src directory, you can import it like this:
 * import { stripe } from '@latten/lib';
 * instead of:
 * import { stripe } from '@latten/lib/src/stripe';
 * This file serves as a central hub for all the exports from the src directory, making it easier to manage and maintain the codebase.
 * 
 * @module @latten/lib
 * @author Latten Creative
 * @license MIT
 * @see {@link https://lattencreative.com}
 */
export * from "./src/stripe";