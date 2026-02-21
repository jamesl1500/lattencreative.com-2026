import Link from 'next/link'
import styles from '@/styles/sections/Booking.module.scss'

export const metadata = {
    title: 'Payment Cancelled',
    description: 'Your payment was cancelled. Your booking is still pending.',
}

export default function BookingCancelledPage() {
    return (
        <div className={styles.resultPage}>
            <div className={styles.resultCard}>
                <div className={`${styles.resultIcon} ${styles.resultIconCancel}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                <h1 className={styles.resultTitle}>Payment Cancelled</h1>
                <p className={styles.resultText}>
                    No worries — your payment was not processed and you have not been 
                    charged. Your booking is saved and you can always come back to 
                    complete the deposit when you are ready.
                </p>

                <Link href="/" className={styles.resultBtn}>
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
