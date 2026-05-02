import Link from 'next/link'
import styles from '@/styles/HomeModern.module.scss'
import { homeStats, processSteps, services, siteConfig, team } from '@/lib/site-content'

export default function Home() {
    return (
        <main className={styles.page}>
            <div className={styles.ambientGlow} />

            <section className={styles.hero}>
                <div>
                    <span className={styles.heroLabel}>Performance + Positioning</span>
                    <h1>Web Systems Built To Convert, Not Just Impress</h1>
                    <p>
                        We design and engineer premium web experiences for service businesses that
                        need sharper positioning, faster pages, and higher-quality leads.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link href="/packages" className={styles.primaryBtn}>Explore Packages</Link>
                        <Link href="/services" className={styles.secondaryBtn}>View Services</Link>
                    </div>
                </div>

                <div className={styles.heroPanel}>
                    <div className={styles.panelCard}>
                        <p className={styles.panelCardTitle}>Current Focus</p>
                        <p className={styles.panelCardValue}>Lead Generation Webflows</p>
                    </div>
                    <div className={styles.panelCard}>
                        <p className={styles.panelCardTitle}>Typical Engagement</p>
                        <p className={styles.panelCardValue}>4-8 week delivery cycles</p>
                    </div>
                    <div className={styles.panelCard}>
                        <p className={styles.panelCardTitle}>Best For</p>
                        <p className={styles.panelCardValue}>Ambitious local and national brands</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionKicker}>Performance Benchmarks</span>
                    <h2>Measured outcomes, not vague promises.</h2>
                </div>
                <div className={styles.statsGrid}>
                    {homeStats.map((item) => (
                        <article key={item.label} className={styles.card}>
                            <div className={styles.statValue}>{item.value}</div>
                            <p className={styles.statLabel}>{item.label}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionKicker}>Services</span>
                    <h2>Strategy, design, and development in one streamlined team.</h2>
                </div>
                <div className={styles.servicesGrid}>
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
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionKicker}>Process</span>
                    <h2>Clear phases, quick feedback loops, and predictable delivery.</h2>
                </div>
                <div className={styles.processGrid}>
                    {processSteps.map((step) => (
                        <article key={step.title} className={styles.card}>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionKicker}>Team</span>
                    <h2>A compact senior team with hands-on execution.</h2>
                </div>
                <div className={styles.teamGrid}>
                    {team.map((member) => (
                        <article key={member.name} className={styles.card}>
                            <h3>{member.name}</h3>
                            <p><strong>{member.role}</strong></p>
                            <p>{member.bio}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionKicker}>Start</span>
                    <h2>Ready to build your next growth engine?</h2>
                    <p>Book a package or reach out directly and we will map the best path for your goals.</p>
                </div>
                <div className={styles.heroCtas}>
                    <Link href="/packages" className={styles.primaryBtn}>Book A Package</Link>
                    <Link href={`mailto:${siteConfig.contactEmail}`} className={styles.secondaryBtn}>
                        {siteConfig.contactEmail}
                    </Link>
                </div>
            </section>
        </main>
    )
}
