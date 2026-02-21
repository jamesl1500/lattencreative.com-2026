'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/sections/Booking.module.scss'

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */
interface PackageData {
    title: string
    slug: { current: string }
    price: number            // cents
    depositPercent: number   // 1-100
    priceLabel?: string
    summary?: string
}

interface BookingFormProps {
    pkg: PackageData
}

type Step = 'schedule' | 'project' | 'info' | 'review'
const STEPS: Step[] = ['schedule', 'project', 'info', 'review']
const STEP_LABELS: Record<Step, string> = {
    schedule: 'Schedule',
    project: 'Project',
    info: 'Your Info',
    review: 'Review',
}

/* ──────────────────────────────────────────────
   Helpers: generate next 14 weekdays
   ────────────────────────────────────────────── */
function getAvailableDates(): Date[] {
    const dates: Date[] = []
    const today = new Date()
    // Start from 2 days ahead to give buffer
    const start = new Date(today)
    start.setDate(start.getDate() + 2)

    let cursor = new Date(start)
    while (dates.length < 14) {
        const day = cursor.getDay()
        if (day !== 0 && day !== 6) {
            dates.push(new Date(cursor))
        }
        cursor.setDate(cursor.getDate() + 1)
    }
    return dates
}

const TIME_SLOTS = [
    '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM',
]

function formatDate(d: Date): string {
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}

function formatDay(d: Date): string {
    return d.toLocaleDateString('en-US', { weekday: 'short' })
}

function formatCurrency(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100)
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
export default function BookingForm({ pkg }: BookingFormProps) {
    const router = useRouter()
    const [step, setStep] = useState<Step>('schedule')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Form state
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [projectDescription, setProjectDescription] = useState('')
    const [projectGoals, setProjectGoals] = useState('')
    const [currentWebsite, setCurrentWebsite] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [companyName, setCompanyName] = useState('')

    const dates = useMemo(() => getAvailableDates(), [])
    const depositAmount = Math.round(pkg.price * (pkg.depositPercent / 100))
    const currentStepIndex = STEPS.indexOf(step)

    const canProceed = useCallback((): boolean => {
        switch (step) {
            case 'schedule':
                return !!selectedDate && !!selectedTime
            case 'project':
                return projectDescription.trim().length >= 10
            case 'info':
                return (
                    customerName.trim().length >= 2 &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
                )
            case 'review':
                return true
            default:
                return false
        }
    }, [step, selectedDate, selectedTime, projectDescription, customerName, customerEmail])

    const nextStep = () => {
        setError(null)
        const idx = STEPS.indexOf(step)
        if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
    }

    const prevStep = () => {
        setError(null)
        const idx = STEPS.indexOf(step)
        if (idx > 0) setStep(STEPS[idx - 1])
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setError(null)

        try {
            // Step 1: Create booking
            const bookingRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    customerPhone: customerPhone || undefined,
                    companyName: companyName || undefined,
                    packageSlug: pkg.slug.current,
                    packageTitle: pkg.title,
                    packagePrice: pkg.price,
                    depositAmount,
                    preferredDate: selectedDate,
                    preferredTime: selectedTime,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    projectDescription,
                    projectGoals: projectGoals || undefined,
                    currentWebsite: currentWebsite || undefined,
                }),
            })

            if (!bookingRes.ok) {
                const data = await bookingRes.json()
                throw new Error(data.error || 'Failed to create booking')
            }

            const { bookingId } = await bookingRes.json()

            // Step 2: Create Stripe Checkout session
            const checkoutRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            })

            if (!checkoutRes.ok) {
                const data = await checkoutRes.json()
                throw new Error(data.error || 'Failed to create checkout session')
            }

            const { url } = await checkoutRes.json()

            // Step 3: Redirect to Stripe Checkout
            if (url) {
                window.location.href = url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong'
            setError(message)
            setSubmitting(false)
        }
    }

    /* ─── Render ─── */
    return (
        <div className={styles.bookingPage}>
            <div className={styles.bookingContainer}>
                {/* Back link */}
                <a href={`/packages/${pkg.slug.current}`} className={styles.backLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to {pkg.title}
                </a>

                {/* Package banner */}
                <div className={styles.packageBanner}>
                    <div className={styles.packageBannerInfo}>
                        <div className={styles.packageBannerTitle}>{pkg.title}</div>
                        <div className={styles.packageBannerPrice}>
                            {pkg.priceLabel || formatCurrency(pkg.price)}
                        </div>
                    </div>
                    <div>
                        <div className={styles.packageBannerDeposit}>
                            {pkg.depositPercent}% deposit
                        </div>
                        <div className={styles.packageBannerPrice}>
                            {formatCurrency(depositAmount)}
                        </div>
                    </div>
                </div>

                {/* Stepper */}
                <div className={styles.stepper}>
                    {STEPS.map((s, i) => (
                        <div key={s} className={styles.stepItem}>
                            <div
                                className={[
                                    i < currentStepIndex
                                        ? styles.stepCompleted
                                        : i === currentStepIndex
                                        ? styles.stepActive
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                <div className={styles.stepCircle}>
                                    {i < currentStepIndex ? '✓' : i + 1}
                                </div>
                                <span className={styles.stepLabel}>{STEP_LABELS[s]}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`${styles.stepDivider} ${
                                        i < currentStepIndex ? styles.stepDividerActive : ''
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Error banner */}
                {error && <div className={styles.errorBanner}>{error}</div>}

                {/* Form card */}
                <div className={styles.formCard}>
                    {/* ─── Step 1: Schedule ─── */}
                    {step === 'schedule' && (
                        <>
                            <h2 className={styles.stepTitle}>Pick a Meeting Time</h2>
                            <p className={styles.stepDescription}>
                                Choose a date and time that works for you. We will send a confirmation 
                                email with a link to join the call.
                            </p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Date</label>
                                    <div className={styles.dateGrid}>
                                        {dates.map((d) => {
                                            const iso = d.toISOString().split('T')[0]
                                            const isSelected = selectedDate === iso
                                            return (
                                                <button
                                                    key={iso}
                                                    type="button"
                                                    className={`${styles.dateOption} ${
                                                        isSelected ? styles.dateOptionSelected : ''
                                                    }`}
                                                    onClick={() => setSelectedDate(iso)}
                                                >
                                                    <span className={styles.dateOptionDay}>
                                                        {formatDay(d)}
                                                    </span>
                                                    <span className={styles.dateOptionDate}>
                                                        {formatDate(d)}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div className={styles.field}>
                                        <label className={styles.label}>Time</label>
                                        <div className={styles.timeGrid}>
                                            {TIME_SLOTS.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    className={`${styles.timeOption} ${
                                                        selectedTime === t
                                                            ? styles.timeOptionSelected
                                                            : ''
                                                    }`}
                                                    onClick={() => setSelectedTime(t)}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ─── Step 2: Project ─── */}
                    {step === 'project' && (
                        <>
                            <h2 className={styles.stepTitle}>Tell Us About Your Project</h2>
                            <p className={styles.stepDescription}>
                                Help us understand what you are looking for so we can make the 
                                most of our call together.
                            </p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Project Description <span className={styles.labelOptional}>*</span>
                                    </label>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="Describe what you need — a new website, a redesign, an app, etc."
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Goals & Outcomes{' '}
                                        <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="What do you want this project to achieve? More leads, better branding, etc."
                                        value={projectGoals}
                                        onChange={(e) => setProjectGoals(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Current Website{' '}
                                        <span className={styles.labelOptional}>(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        className={styles.input}
                                        placeholder="https://example.com"
                                        value={currentWebsite}
                                        onChange={(e) => setCurrentWebsite(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ─── Step 3: Your Info ─── */}
                    {step === 'info' && (
                        <>
                            <h2 className={styles.stepTitle}>Your Information</h2>
                            <p className={styles.stepDescription}>
                                We will use this to send you the meeting invite and booking 
                                confirmation.
                            </p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Full Name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Jane Doe"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Email *</label>
                                        <input
                                            type="email"
                                            className={styles.input}
                                            placeholder="jane@company.com"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>
                                            Phone{' '}
                                            <span className={styles.labelOptional}>(optional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            placeholder="(555) 123-4567"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>
                                            Company{' '}
                                            <span className={styles.labelOptional}>(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Acme Inc."
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ─── Step 4: Review ─── */}
                    {step === 'review' && (
                        <>
                            <h2 className={styles.stepTitle}>Review & Pay Deposit</h2>
                            <p className={styles.stepDescription}>
                                Look over your booking details below. Once everything looks 
                                good, you will be redirected to our secure payment page.
                            </p>

                            <div className={styles.reviewSection}>
                                <div className={styles.reviewLabel}>Meeting</div>
                                <div className={styles.reviewCard}>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Date</span>
                                        <span className={styles.reviewValue}>
                                            {new Date(selectedDate + 'T12:00:00').toLocaleDateString(
                                                'en-US',
                                                { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
                                            )}
                                        </span>
                                    </div>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Time</span>
                                        <span className={styles.reviewValue}>{selectedTime}</span>
                                    </div>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Timezone</span>
                                        <span className={styles.reviewValue}>
                                            {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.reviewSection}>
                                <div className={styles.reviewLabel}>Project</div>
                                <div className={styles.reviewCard}>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Description</span>
                                        <span className={styles.reviewValue}>{projectDescription}</span>
                                    </div>
                                    {projectGoals && (
                                        <div className={styles.reviewRow}>
                                            <span className={styles.reviewKey}>Goals</span>
                                            <span className={styles.reviewValue}>{projectGoals}</span>
                                        </div>
                                    )}
                                    {currentWebsite && (
                                        <div className={styles.reviewRow}>
                                            <span className={styles.reviewKey}>Current site</span>
                                            <span className={styles.reviewValue}>{currentWebsite}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.reviewSection}>
                                <div className={styles.reviewLabel}>Contact</div>
                                <div className={styles.reviewCard}>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Name</span>
                                        <span className={styles.reviewValue}>{customerName}</span>
                                    </div>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Email</span>
                                        <span className={styles.reviewValue}>{customerEmail}</span>
                                    </div>
                                    {customerPhone && (
                                        <div className={styles.reviewRow}>
                                            <span className={styles.reviewKey}>Phone</span>
                                            <span className={styles.reviewValue}>{customerPhone}</span>
                                        </div>
                                    )}
                                    {companyName && (
                                        <div className={styles.reviewRow}>
                                            <span className={styles.reviewKey}>Company</span>
                                            <span className={styles.reviewValue}>{companyName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.priceSummary}>
                                <div className={styles.priceTotal}>
                                    {pkg.depositPercent}% Deposit Due Today
                                </div>
                                <div className={styles.priceAmount}>
                                    {formatCurrency(depositAmount)}
                                </div>
                                <div className={styles.priceNote}>
                                    of {formatCurrency(pkg.price)} total
                                </div>
                            </div>
                        </>
                    )}

                    {/* ─── Navigation ─── */}
                    <div className={styles.formNav}>
                        {currentStepIndex > 0 ? (
                            <button
                                type="button"
                                className={styles.btnBack}
                                onClick={prevStep}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                Back
                            </button>
                        ) : (
                            <span />
                        )}

                        {step === 'review' ? (
                            <button
                                type="button"
                                className={styles.btnPay}
                                disabled={submitting}
                                onClick={handleSubmit}
                            >
                                {submitting ? (
                                    <>
                                        <span className={styles.spinner} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay {formatCurrency(depositAmount)} Deposit
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.btnNext}
                                disabled={!canProceed()}
                                onClick={nextStep}
                            >
                                Continue
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
