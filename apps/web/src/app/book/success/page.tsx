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

                <h1 className={styles.resultTitle}>You are All Set!</h1>
                <p className={styles.resultText}>
                    Your deposit has been received and your booking is confirmed. 
                    We have sent a confirmation email with your meeting details and 
                    a calendar invite. Looking forward to speaking with you!
                </p>

                <Link href="/" className={styles.resultBtn}>
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
