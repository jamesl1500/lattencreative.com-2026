import Link from 'next/link'
import styles from '@/styles/sections/Booking.module.scss'

export const metadata = {
    title: 'Booking Confirmed',
    description: 'Your deposit has been received and your booking is confirmed.',
}

export default function BookingSuccessPage() {
    return (
        <div className={styles.resultPage}>
            <div className={styles.resultCard}>
                <div className={`${styles.resultIcon} ${styles.resultIconSuccess}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

                <h1 className={styles.resultTitle}>Booking Confirmed</h1>
                <p className={styles.resultText}>
                    Your deposit has been received and your call is locked in.
                    We sent your confirmation email and calendar invite, and our team
                    will come prepared with your package details and project notes.
                </p>

                <Link href="/packages" className={styles.resultBtn}>
                    View More Packages
                </Link>
            </div>
        </div>
    )
}
