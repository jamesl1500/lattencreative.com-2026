import Link from 'next/link'
import styles from '@/styles/MarketingPages.module.scss'
import { processSteps, team } from '@/lib/site-content'

export const metadata = {
    title: 'About',
    description: 'Meet Latten Creative and how we approach strategy, design, and growth.',
}

export default function AboutPage() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <p className={styles.kicker}>About</p>
                <h1>We build digital systems that make ambitious brands impossible to ignore.</h1>
                <p>
                    Latten Creative is a strategy-first studio focused on websites that drive real business outcomes.
                    Every engagement starts with positioning and ends with a launch plan designed for growth.
                </p>
            </section>

            <section className={styles.grid2}>
                <article className={styles.card}>
                    <h3>Our Philosophy</h3>
                    <p>
                        Great design is not decoration. It is clarity, trust, and momentum delivered through every
                        interaction in your funnel.
                    </p>
                </article>
                <article className={styles.card}>
                    <h3>How We Work</h3>
                    <p>
                        Tight communication, rapid iterations, and measurable KPIs from day one. No bloated process,
                        no ambiguity.
                    </p>
                </article>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <div className={styles.grid3}>
                    {processSteps.map((step) => (
                        <article key={step.title} className={styles.card}>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <div className={styles.grid2}>
                    {team.map((member) => (
                        <article key={member.name} className={styles.card}>
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                            <p>{member.bio}</p>
                        </article>
                    ))}
                </div>
                <div className={styles.actions}>
                    <Link href="/packages" className={styles.primaryBtn}>View Packages</Link>
                    <Link href="/contact" className={styles.secondaryBtn}>Contact Us</Link>
                </div>
            </section>
        </main>
    )
}
