'use client'

import styles from '@/styles/sections/Sections.module.scss'

type ContactSectionProps = {
    headline?: string
    subtitle?: string
    showForm?: boolean
    email?: string
    phone?: string
    address?: string
    [key: string]: unknown
}

export default function ContactSection(props: ContactSectionProps) {
    const { headline, subtitle, showForm = true, email, phone, address } = props

    return (
        <section className={styles.sectionAlt} id="contact">
            <div className={styles.container}>
                {(headline || subtitle) && (
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>Get In Touch</span>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.contactGrid}>
                    {showForm && (
                        <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                            <input className={styles.input} type="text" placeholder="Your Name" required />
                            <input className={styles.input} type="email" placeholder="Your Email" required />
                            <input className={styles.input} type="text" placeholder="Subject" />
                            <textarea className={styles.textarea} placeholder="Tell us about your project..." required />
                            <button type="submit" className={styles.btnPrimary}>
                                Send Message
                            </button>
                        </form>
                    )}

                    <div>
                        <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>
                            Let&apos;s start a conversation
                        </h3>
                        <p className={styles.body} style={{ marginBottom: '1.5rem' }}>
                            Whether you have a project in mind or just want to chat about possibilities,
                            we&apos;d love to hear from you.
                        </p>
                        {email && (
                            <a href={`mailto:${email}`} className={styles.btnSecondary}>
                                {email}
                            </a>
                        )}
                        {phone && (
                            <a href={`tel:${phone}`} className={styles.btnSecondary} style={{ marginLeft: '1rem' }}>
                                {phone}
                            </a>
                        )}
                        {address && (
                            <p className={styles.btnSecondary} style={{ marginTop: '1.5rem' }}>
                                {address}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
