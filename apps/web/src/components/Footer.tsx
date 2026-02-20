import Link from 'next/link'
import styles from '@/styles/Footer.module.scss'

type NavItem = { label: string; href: string }
type SocialLink = { platform: string; url: string }

type FooterProps = {
    siteName?: string
    footerText?: string
    navigation?: NavItem[]
    socialLinks?: SocialLink[]
    contactEmail?: string
}

const socialLabels: Record<string, string> = {
    twitter: 'Twitter / X',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    dribbble: 'Dribbble',
    behance: 'Behance',
    youtube: 'YouTube',
    facebook: 'Facebook',
}

export default function Footer({
    siteName,
    footerText,
    navigation = [],
    socialLinks = [],
    contactEmail,
}: FooterProps) {
    const year = new Date().getFullYear()
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.brand}>
                    <h3>{siteName ?? 'Latten Creative'}</h3>
                    <p>{footerText ?? 'Designing exceptional digital experiences that elevate brands and drive results.'}</p>
                </div>

                <div className={styles.column}>
                    <h4>Navigation</h4>
                    <ul>
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Connect</h4>
                    <ul>
                        {contactEmail && (
                            <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
                        )}
                        {socialLinks.map((s) => (
                            <li key={s.platform}>
                                <a href={s.url} target="_blank" rel="noopener noreferrer">
                                    {socialLabels[s.platform] ?? s.platform}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.bottom}>
                <span>&copy; {year} {siteName ?? 'Latten Creative'}. All rights reserved.</span>
                <div className={styles.socials}>
                    {socialLinks.map((s) => (
                        <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}>
                            {socialLabels[s.platform] ?? s.platform}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
