'use client'

import { useState, useCallback } from 'react'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import styles from '@/styles/sections/Booking.module.scss'

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */
interface PackageData {
    id: string
    title: string
    slug: string
    price: number            // cents
    depositPercent: number   // 1-100
    priceLabel?: string
    summary?: string
}

interface BookingFormProps {
    pkg: PackageData
}

type Step = 'info' | 'schedule' | 'project' | 'review'
const STEPS: Step[] = ['info', 'schedule', 'project', 'review']
const STEP_LABELS: Record<Step, string> = {
    info: 'Your Info',
    schedule: 'Schedule',
    project: 'Project',
    review: 'Review',
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */
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
    const [step, setStep] = useState<Step>('info')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Calendly state
    const [calendlyEventUri, setCalendlyEventUri] = useState<string>('')
    const [calendlyInviteeUri, setCalendlyInviteeUri] = useState<string>('')

    // Form state
    const [projectDescription, setProjectDescription] = useState('')
    const [projectGoals, setProjectGoals] = useState('')
    const [currentWebsite, setCurrentWebsite] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [companyName, setCompanyName] = useState('')

    const depositAmount = Math.round(pkg.price * (pkg.depositPercent / 100))
    const currentStepIndex = STEPS.indexOf(step)
    const progressPercent = (currentStepIndex / (STEPS.length - 1)) * 100

    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? ''

    // Listen for Calendly event_scheduled and auto-advance
    useCalendlyEventListener({
        onEventScheduled: (e) => {
            setCalendlyEventUri(e.data.payload.event.uri)
            setCalendlyInviteeUri(e.data.payload.invitee.uri)
            setStep('project')
        },
    })

    const canProceed = useCallback((): boolean => {
        switch (step) {
            case 'info':
                return (
                    customerName.trim().length >= 2 &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
                )
            case 'schedule':
                return !!calendlyEventUri
            case 'project':
                return projectDescription.trim().length >= 10
            case 'review':
                return true
            default:
                return false
        }
    }, [step, customerName, customerEmail, calendlyEventUri, projectDescription])

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
                    packageId: pkg.id,
                    calendlyEventUri,
                    calendlyInviteeUri,
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
                <a href={`/packages/${pkg.id}`} className={styles.backLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to {pkg.title}
                </a>

                <header className={styles.bookingIntro}>
                    <h1>Book Your {pkg.title} Package</h1>
                    <p>
                        Complete these steps to schedule your call and secure your project with
                        a deposit. You can review everything before payment.
                    </p>
                </header>

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
                <div className={styles.progressWrap}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className={styles.stepper}>
                    {STEPS.map((s, i) => (
                        <div
                            key={s}
                            className={styles.stepItem}
                            style={{ animationDelay: `${i * 70}ms` }}
                        >
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
                                <div className={styles.stepTextWrap}>
                                    <span className={styles.stepLabel}>{STEP_LABELS[s]}</span>
                                    {i === currentStepIndex && (
                                        <span className={styles.stepHint}>Current Step</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error banner */}
                {error && <div className={styles.errorBanner}>{error}</div>}

                {/* Form card */}
                <div className={step === 'schedule' ? styles.formCardWide : styles.formCard}>

                    {/* ─── Step 1: Your Info ─── */}
                    {step === 'info' && (
                        <>
                            <h2 className={styles.stepTitle}>Your Information</h2>
                            <p className={styles.stepDescription}>
                                Enter your details so we can send you the meeting invite and 
                                booking confirmation.
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

                    {/* ─── Step 2: Schedule via Calendly ─── */}
                    {step === 'schedule' && (
                        <>
                            <h2 className={styles.stepTitle}>Pick a Meeting Time</h2>
                            <p className={styles.stepDescription}>
                                Choose a date and time that works for you. You will receive a 
                                confirmation email with a calendar invite once scheduled.
                            </p>

                            {calendlyUrl ? (
                                <InlineWidget
                                    url={calendlyUrl}
                                    prefill={{
                                        name: customerName,
                                        email: customerEmail,
                                    }}
                                    styles={{ minWidth: '320px', height: '700px' }}
                                />
                            ) : (
                                <p className={styles.stepDescription} style={{ color: 'red' }}>
                                    Calendly URL is not configured. Set NEXT_PUBLIC_CALENDLY_URL.
                                </p>
                            )}

                            {calendlyEventUri && (
                                <div className={styles.calendlyConfirmed}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Meeting scheduled — check your email for confirmation!
                                </div>
                            )}
                        </>
                    )}

                    {/* ─── Step 3: Project ─── */}
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
                                        <span className={styles.reviewKey}>Status</span>
                                        <span className={`${styles.reviewValue} ${styles.reviewValueSuccess}`}>
                                            Scheduled via Calendly
                                        </span>
                                    </div>
                                    <div className={styles.reviewRow}>
                                        <span className={styles.reviewKey}>Confirmation</span>
                                        <span className={styles.reviewValue}>
                                            Sent to {customerEmail}
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
                        ) : step === 'schedule' ? (
                            /* On schedule step, only show Continue once Calendly fires */
                            calendlyEventUri ? (
                                <button
                                    type="button"
                                    className={styles.btnNext}
                                    onClick={nextStep}
                                >
                                    Continue
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            ) : (
                                <span />
                            )
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
