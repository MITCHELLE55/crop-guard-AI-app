import { useEffect, useState } from 'react'
import SpecialistLayout from './layouts/SpecialistLayout'
import CommandCentre from './portals/specialist/pages/CommandCentre'
import type { SpecialistSection } from './portals/specialist/types'
import OfficePortal from './portals/agricultural-office/pages/OfficePortal'
import OfficeLogin from './portals/agricultural-office/pages/OfficeLogin'
import SpecialistLogin from './portals/specialist/pages/SpecialistLogin'
import './App.css'

/**
 * The two kinds of users who have separate demo workspaces.
 * The name is used only to choose which local prototype screen to show.
 */
type PortalName = 'specialist' | 'office'

/**
 * The browser paths for the two sign in pages and their demo workspaces.
 * Opening a workspace path without its matching in memory demo sign in sends the user back to sign in.
 */
type PortalPath = '/specialist/login' | '/office/login' | '/specialist' | '/office'

const sectionContent: Partial<Record<
  SpecialistSection,
  { title: string; description: string; items: string[] }
>> = {
  visits: {
    title: 'Farm visit management',
    description: 'Plan field visits, prepare inspection checklists and record visit outcomes.',
    items: ['Visit schedule', 'Route & navigation', 'Field inspection', 'Visit reports'],
  },
  treatments: {
    title: 'Treatment catalogue',
    description: 'Compare treatment guidance, safety instructions and local availability.',
    items: ['Chemicals', 'Dosage & application', 'Stock availability', 'Treatment history'],
  },
  communication: {
    title: 'Communication centre',
    description: 'Keep farmer messages and follow-up conversations connected to their cases.',
    items: ['Farmer messages', 'Calls', 'Communication history'],
  },
  reports: {
    title: 'Reports & analytics',
    description: 'A future home for case outcomes, visit completion and follow-up performance.',
    items: ['Case resolution', 'Visit completion', 'Follow-up outcomes'],
  },
  settings: {
    title: 'Profile & settings',
    description: 'Manage specialist details, availability, preferences and offline sync.',
    items: ['Specialist profile', 'Availability', 'Preferences', 'Offline synchronization'],
  },
}

/**
 * Chooses the correct sign in or workspace page for a browser path.
 * It keeps users on their own portal's sign in page unless that portal's local demo sign in has happened.
 * @param pathname The current browser path, such as `/office` or `/specialist/login`.
 * @param signedInPortal The portal signed into during this page load, or `null` when no demo sign in happened.
 * @returns One of the supported portal paths, sending unknown paths to specialist sign in.
 * @remarks `App` uses this when the page first opens and when the browser back or forward button is used.
 */
function resolvePortalPath(pathname: string, signedInPortal: PortalName | null): PortalPath {
  // Sign in pages are public entry points for their own portal.
  if (pathname === '/specialist/login' || pathname === '/office/login') return pathname

  // A workspace is shown only after its matching local demo sign in.
  if (pathname === '/specialist' && signedInPortal === 'specialist') return '/specialist'
  if (pathname === '/office' && signedInPortal === 'office') return '/office'

  // Send an unsigned user to the matching sign in page, and unknown paths to the specialist entry point.
  return pathname === '/office' ? '/office/login' : '/specialist/login'
}

/**
 * The root component for the Crop Guard AI application.
 * It routes the specialist and agricultural office to separate sign in pages and demo workspaces.
 * @returns The page that matches the current portal URL.
 * @remarks `main.tsx` renders this component. Demo sign in is local only and does not authenticate or store credentials.
 */
function App() {
  const [signedInPortal, setSignedInPortal] = useState<PortalName | null>(null)
  const [pathname, setPathname] = useState<PortalPath>(() =>
    resolvePortalPath(window.location.pathname, null),
  )
  const [activeSection, setActiveSection] = useState<SpecialistSection>('command-centre')
  const [searchQuery, setSearchQuery] = useState('')

  // Keep the browser tab title aligned with the portal and screen currently being shown.
  const pageTitle = pathname.startsWith('/office')
    ? 'Agricultural Office | Crop Guard AI'
    : pathname === '/specialist'
      ? 'Crop Guard AI | Specialist Portal'
      : 'Agricultural Specialist Login | Crop Guard AI'

  useEffect(() => {
    document.title = pageTitle
  }, [pageTitle])

  // Keep React in sync with direct URL visits and browser back or forward navigation.
  useEffect(() => {
    const syncPath = () => {
      const nextPath = resolvePortalPath(window.location.pathname, signedInPortal)

      // Replace invalid or unsigned workspace URLs so the address bar matches the screen that is allowed.
      if (window.location.pathname !== nextPath) {
        window.history.replaceState({}, '', nextPath)
      }

      setPathname(nextPath)
    }

    syncPath()
    window.addEventListener('popstate', syncPath)

    return () => window.removeEventListener('popstate', syncPath)
  }, [signedInPortal])

  /**
   * Changes the browser URL and the visible page without reloading the application.
   * @param path The supported portal path, such as `/office/login`.
   * @returns Nothing; it updates browser history and the current page state.
   * @remarks Portal buttons use this so their URL can be bookmarked and browser navigation works.
   */
  const navigateTo = (path: PortalPath) => {
    // Add a browser history entry only when the destination is different from the current URL.
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setPathname(path)
  }

  /**
   * Opens the selected portal's local demo workspace after its sign in form is submitted.
   * The entered credentials are deliberately ignored because no authentication service is connected.
   * @param portal The portal whose sign in form was submitted, either `specialist` or `office`.
   * @returns Nothing; it remembers the demo portal for this page load and opens its workspace.
   * @remarks Both separate sign in pages call this after the browser validates their required fields.
   */
  const handleDemoSignIn = (portal: PortalName) => {
    setSignedInPortal(portal)
    // Specialists always return to their main section after the demo sign in is submitted.
    if (portal === 'specialist') {
      setActiveSection('command-centre')
    }
    navigateTo(portal === 'office' ? '/office' : '/specialist')
  }

  /**
   * Opens the office sign in page and ends the current local demo portal session.
   * @returns Nothing; the browser moves to `/office/login`.
   * @remarks The specialist navigation uses this instead of opening the office workspace directly.
   */
  const handleOpenOfficeLogin = () => {
    setSignedInPortal(null)
    navigateTo('/office/login')
  }

  /**
   * Opens the specialist sign in page and ends the current local demo portal session.
   * @returns Nothing; the browser moves to `/specialist/login`.
   * @remarks The office navigation uses this instead of opening the specialist workspace directly.
   */
  const handleOpenSpecialistLogin = () => {
    setSignedInPortal(null)
    navigateTo('/specialist/login')
  }

  // Each portal has its own sign in screen and submits to its own local demo workspace.
  if (pathname === '/specialist/login') {
    return <SpecialistLogin onSignIn={() => handleDemoSignIn('specialist')} />
  }

  if (pathname === '/office/login') {
    return <OfficeLogin onSignIn={() => handleDemoSignIn('office')} />
  }

  // Office portal navigation leads to specialist sign in, never straight into that workspace.
  if (pathname === '/office' && signedInPortal === 'office') {
    return <OfficePortal onOpenSpecialistLogin={handleOpenSpecialistLogin} />
  }

  // The specialist workspace remains grouped inside its own layout and navigation.
  return (
    <SpecialistLayout
      activeSection={activeSection}
      onNavigate={setActiveSection}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onOpenOfficeLogin={handleOpenOfficeLogin}
    >
      {activeSection === 'command-centre'
        || activeSection === 'consultation'
        || activeSection === 'cases'
        || activeSection === 'intelligence'
        || activeSection === 'treatments'
        || activeSection === 'communication'
        || activeSection === 'records' ? (
        <CommandCentre
          activeSection={activeSection}
          showConsultation={activeSection === 'consultation'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenConsultation={() => setActiveSection('consultation')}
          onNavigate={setActiveSection}
        />
      ) : (
        <section className="module-page">
          <div className="module-heading">
            <div>
              <span className="eyebrow">SPECIALIST PORTAL</span>
              <h1>{sectionContent[activeSection]?.title}</h1>
              <p>{sectionContent[activeSection]?.description}</p>
            </div>
            <span className="demo-label">Workspace preview</span>
          </div>
          <div className="module-grid">
            {sectionContent[activeSection]?.items.map((item, index) => (
              <article className="module-card" key={item}>
                <span className="module-card-index">0{index + 1}</span>
                <h2>{item}</h2>
                <p>Connect this section to live Crop Guard AI records as the service layer is added.</p>
              </article>
            ))}
          </div>
          <div className="module-note">
            <strong>Prototype data only.</strong> No farmer records or operational metrics are connected yet.
          </div>
        </section>
      )}
    </SpecialistLayout>
  )
}

export default App
