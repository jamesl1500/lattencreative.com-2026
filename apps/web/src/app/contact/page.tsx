'use client'

import { FormEvent, useState } from 'react'
import styles from '@/styles/MarketingPages.module.scss'
import { siteConfig } from '@/lib/site-content'

export default function ContactPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
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
                body: JSON.stringify({ name, email, subject, message }),
            })

            if (!res.ok) throw new Error('Failed to send')

            setName('')
            setEmail('')
            setSubject('')
            setMessage('')
            setStatus('sent')
        } catch {
            setStatus('error')
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <p className={styles.kicker}>Contact</p>
                <h1>Tell us who you are, and where you want to go next.</h1>
                <p>
                    Share context on your business, current website, and growth goals.
                    We usually respond within one business day.
                </p>
            </section>

            <section className={styles.grid2}>
                <form className={`${styles.card} ${styles.form}`} onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className={styles.input}
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder="Project details"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <button className={styles.primaryBtn} disabled={status === 'sending'} type="submit">
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                    {status === 'sent' && <p>Thanks, your message has been sent.</p>}
                    {status === 'error' && <p>Something went wrong. Please try again.</p>}
                </form>

                <aside className={styles.card}>
                    <h3>Direct Contact</h3>
                    <p>Email: {siteConfig.contactEmail}</p>
                    <p>Phone: {siteConfig.contactPhone}</p>
                    <p>Location: {siteConfig.address}</p>
                    <div className={styles.actions}>
                        <a className={styles.secondaryBtn} href={`mailto:${siteConfig.contactEmail}`}>
                            Email Us
                        </a>
                        <a className={styles.secondaryBtn} href={`tel:${siteConfig.contactPhone.replace(/[^\d+]/g, '')}`}>
                            Call Us
                        </a>
                    </div>
                </aside>
            </section>
        </main>
    )
}
