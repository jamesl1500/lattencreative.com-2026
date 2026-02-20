import Image from 'next/image'
import styles from '@/styles/sections/Sections.module.scss'
import { urlFor } from '@/lib/sanity.image'

type TeamMemberRef = {
    _id: string
    name?: string
    role?: string
    bio?: string
    photo?: { asset: { _ref: string }; alt?: string }
}

type TeamSectionProps = {
    headline?: string
    subtitle?: string
    members?: TeamMemberRef[]
    [key: string]: unknown
}

export default function TeamSection(props: TeamSectionProps) {
    const { headline, subtitle, members = [] } = props

    return (
        <section className={styles.sectionAlt}>
            <div className={styles.container}>
                {(headline || subtitle) && (
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>Our Team</span>
                        {headline && <h2 className={styles.heading}>{headline}</h2>}
                        {subtitle && <p className={styles.subheading}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.grid4}>
                    {members.map((m) => (
                        <div key={m._id} className={styles.teamCard}>
                            {m.photo?.asset && (
                                <Image
                                    src={urlFor(m.photo).width(400).height(400).url()}
                                    alt={m.photo.alt ?? m.name ?? ''}
                                    width={400}
                                    height={400}
                                    className={styles.teamPhoto}
                                />
                            )}
                            {m.name && <div className={styles.teamName}>{m.name}</div>}
                            {m.role && <div className={styles.teamRole}>{m.role}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
