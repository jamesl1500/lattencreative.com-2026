"use client"

import { useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/Header.module.scss'

type NavItem = { label: string; href: string }
type CtaButton = { text?: string; link?: string; label?: string; href?: string }

type HeaderProps = {
    siteName?: string
    navigation?: NavItem[]
    ctaButton?: CtaButton
}

export default function Header({ siteName, navigation = [], ctaButton }: HeaderProps) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const ctaLabel = ctaButton?.text ?? ctaButton?.label
    const ctaHref = ctaButton?.link ?? ctaButton?.href ?? '/contact'

    const closeMobile = () => setMobileOpen(false)

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <Link href="/" className={styles.logo}>
                    {siteName ?? 'Latten Creative'}
                </Link>

                <nav className={styles.nav}>
                    {navigation.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.navLink}>
                            {item.label}
                        </Link>
                    ))}
                    {ctaLabel && (
                        <Link href={ctaHref} className={styles.ctaBtn}>
                            {ctaLabel}
                        </Link>
                    )}
                </nav>

                <button
                    className={styles.mobileToggle}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    onClick={() => setMobileOpen((prev) => !prev)}
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>
            </div>

            <nav
                id="mobile-nav"
                className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ''}`}
                aria-hidden={!mobileOpen}
            >
                {navigation.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.mobileNavLink} onClick={closeMobile}>
                        {item.label}
                    </Link>
                ))}
                {ctaLabel && (
                    <Link href={ctaHref} className={styles.mobileCtaBtn} onClick={closeMobile}>
                        {ctaLabel}
                    </Link>
                )}
            </nav>
        </header>
    )
}
