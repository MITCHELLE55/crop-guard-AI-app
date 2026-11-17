import { useEffect, useState } from 'react'
import SpecialistLayout from './layouts/SpecialistLayout'
import CommandCentre from './portals/specialist/pages/CommandCentre'
import type { SpecialistSection } from './portals/specialist/types'
import OfficePortal from './portals/agricultural-office/pages/OfficePortal'
import SpecialistLogin from './portals/specialist/pages/SpecialistLogin'
import './App.css'

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
 * The root component for the Crop Guard AI application.
 * It shows a local demo login first, then opens the selected specialist or office portal.
 * @returns The login screen or the selected portal workspace.
 * @remarks This component is rendered by `main.tsx` and does not authenticate or store credentials.
 */
function App() {
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [activePortal, setActivePortal] = useState<'specialist' | 'office'>('specialist')
  const [activeSection, setActiveSection] = useState<SpecialistSection>('command-centre')
  const [searchQuery, setSearchQuery] = useState('')

  const pageTitle = showWorkspace
    ? activePortal === 'office'
      ? 'Agricultural Office | Crop Guard AI'
      : 'Crop Guard AI | Specialist Portal'
    : 'Agricultural Specialist Login | Crop Guard AI'

  // Keep the browser tab title aligned with the portal or login screen the user is viewing.
  useEffect(() => {
    document.title = pageTitle
  }, [pageTitle])

  /**
   * Opens the prototype workspace after the browser accepts the required form fields.
   * It deliberately ignores the entered credentials because no authentication service is connected.
   * @returns Nothing; it only changes which screen is displayed.
   */
  const handleDemoSignIn = () => {
    setShowWorkspace(true)
  }

  // Keep the existing workspaces reachable while the login experience remains a local-only prototype.
  if (!showWorkspace) {
    return <SpecialistLogin onSignIn={handleDemoSignIn} />
  }

  if (activePortal === 'office') {
    // The office return action always opens the dashboard, not the previously selected specialist module.
    return <OfficePortal onSwitchPortal={() => { setActivePortal('specialist'); setActiveSection('command-centre') }} />
  }

  return (
    <SpecialistLayout
      activeSection={activeSection}
      onNavigate={setActiveSection}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSwitchPortal={() => setActivePortal('office')}
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
