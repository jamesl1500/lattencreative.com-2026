import page from './page'
import hero from './hero'
import features from './features'
import cta from './cta'
import testimonials from './testimonials'
import siteSettings from './siteSettings'
import service from './service'
import project from './project'
import teamMember from './teamMember'
import post from './post'
import servicesSection from './servicesSection'
import projectsSection from './projectsSection'
import teamSection from './teamSection'
import statsSection from './statsSection'
import contactSection from './contactSection'
import textSection from './textSection'
import textListSection from './textListSection'
import textImageSection from './textImageSection'
import textCtaSection from './textCtaSection'
import packageSchema from './package'
import packagesSection from './packagesSection'

export const schemaTypes = [
    // Singletons
    siteSettings,
    // Documents
    page,
    service,
    project,
    teamMember,
    post,
    packageSchema,
    // Section objects (used inside page.content)
    hero,
    features,
    cta,
    testimonials,
    servicesSection,
    projectsSection,
    teamSection,
    statsSection,
    contactSection,
    textSection,
    textListSection,
    textImageSection,
    textCtaSection,
    packagesSection,
]