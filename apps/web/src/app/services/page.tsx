import Link from 'next/link'
import styles from '@/styles/MarketingPages.module.scss'
import { services } from '@/lib/site-content'

export const metadata = {
    title: 'Services',
    description: 'Explore Latten Creative services for websites, conversion systems, and growth support.',
}

export default function ServicesPage() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <p className={styles.kicker}>Services</p>
                <h1>High-velocity creative and engineering for growth-minded brands.</h1>
                <p>
                    We combine strategic messaging, premium visual systems, and production-grade frontend builds
                    to create websites that look exceptional and perform even better.
                </p>
            </section>

            <section className={styles.grid3}>
                {services.map((service) => (
                    <article key={service.id} className={styles.card}>
                        <h3>{service.title}</h3>
                        <p>{service.summary}</p>
                        <ul>
                            {service.deliverables.map((deliverable) => (
                                <li key={deliverable}>{deliverable}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            <section style={{ marginTop: '2rem' }} className={styles.card}>
                <h3>Need a blended scope?</h3>
                <p>
                    Most clients combine two or more service tracks. We will shape a focused roadmap during discovery
                    and align scope with your growth targets.
                </p>
                <div className={styles.actions}>
                    <Link href="/packages" className={styles.primaryBtn}>See Pricing Packages</Link>
                    <Link href="/contact" className={styles.secondaryBtn}>Start A Conversation</Link>
                </div>
            </section>
        </main>
    )
}
