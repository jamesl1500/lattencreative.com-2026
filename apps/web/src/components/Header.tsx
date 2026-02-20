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
    const ctaLabel = ctaButton?.text ?? ctaButton?.label
    const ctaHref = ctaButton?.link ?? ctaButton?.href ?? '/contact'

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

                <button className={styles.mobileToggle} aria-label="Menu">
                    &#9776;
                </button>
            </div>
        </header>
    )
}
