'use client'

import { useState, type FormEvent } from 'react'
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

    const [name, setName] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setStatus('sending')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: contactEmail, subject, message }),
            })

            if (!res.ok) throw new Error('Failed')

            setStatus('sent')
            setName('')
            setContactEmail('')
            setSubject('')
            setMessage('')
        } catch {
            setStatus('error')
        }
    }

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
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                className={styles.input}
                                type="email"
                                placeholder="Your Email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            <textarea
                                className={styles.textarea}
                                placeholder="Tell us about your project..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'sent' && (
                                <p style={{ color: '#10b981', marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Message sent! We will get back to you soon.
                                </p>
                            )}
                            {status === 'error' && (
                                <p style={{ color: '#ef4444', marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Something went wrong. Please try again.
                                </p>
                            )}
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
