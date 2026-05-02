/**
 * Supabase Packages
 * ----
 * Typed helpers for fetching packages from Supabase.
 *
 * @module @latten/web/packages
 * @author Latten Creative
 * @license MIT
 */
import { supabase } from './supabase'

export interface SupabasePackage {
    id: string
    title: string
    slug: string
    category: 'website' | 'bundle' | 'maintenance' | 'marketing'
    tagline: string | null
    price_label: string
    price_min: number | null   // cents – for range pricing
    price_max: number | null   // cents – null = open-ended
    price_exact: number | null // cents – for fixed-price items
    is_monthly: boolean
    deposit_percent: number
    summary: string | null
    description: string | null
    features: string[]
    ideal_for: string[]
    cta_copy: string | null
    cta_button_text: string | null
    is_active: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

/**
 * Returns the single price value in cents to use for booking / deposit
 * calculations. Uses price_exact for fixed packages, price_min for ranges.
 */
export function getBookingPrice(pkg: SupabasePackage): number {
    return pkg.price_exact ?? pkg.price_min ?? 0
}

export const CATEGORY_LABELS: Record<SupabasePackage['category'], string> = {
    website:     'Website Packages',
    bundle:      'Launch Bundles',
    maintenance: 'Maintenance Plans',
    marketing:   'Marketing Packages',
}

export async function getAllPackages(): Promise<SupabasePackage[]> {
    const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order')

    if (error) {
        console.error('Failed to load packages from Supabase:', error.message)
        return []
    }
    return (data ?? []) as SupabasePackage[]
}

export async function getPackageBySlug(slug: string): Promise<SupabasePackage | null> {
    const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (error) return null
    return data as SupabasePackage
}

export async function getPackageById(id: string): Promise<SupabasePackage | null> {
    const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

    if (error) return null
    return data as SupabasePackage
}
