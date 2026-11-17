/**
 * This page is the agricultural office team's local support workspace.
 * Office coordinators use it to review farmer records, assign specialists, schedule field visits,
 * track resources, and view illustrative service activity.
 * The screen has an overview, farmer registry, visits, resources and schedules, and reports.
 * The sidebar changes between these sections. The top bar searches farmer records and returns to
 * the specialist dashboard. Forms add visits and assignments to local page state only.
 * All farmer, specialist, resource, and report values are demonstration data. Nothing is loaded
 * from or saved to an API. Data is ready immediately, so no network loading or server error state
 * applies. Empty registry searches show an explanatory message, and local actions show notices.
 * The office portal is opened from the specialist top bar and its return control opens Command Centre.
 */
import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Icon from '../../../components/Icon'
import './office-portal.css'

/** The five destinations in the agricultural office sidebar. */
type OfficeSection = 'overview' | 'farmers' | 'visits' | 'resources' | 'reports'

/**
 * One illustrative farmer record used by the office registry.
 * @remarks These records stay in local state and are not connected to a farmer database.
 */
type Farmer = {
  id: string
  name: string
  initials: string
  crop: string
  location: string
  issue: string
  specialist: string
  status: 'Needs support' | 'Assigned' | 'Follow-up'
}

/**
 * One local office visit scheduled with a farmer and specialist.
 * @remarks New records are kept only for the current browser session.
 */
type OfficeVisit = {
  id: string
  farmer: string
  farmerId: string
  location: string
  date: string
  time: string
  specialist: string
  purpose: string
  status: 'Confirmed' | 'Awaiting confirmation'
}

const initialFarmers: Farmer[] = [
  { id: 'REC-2026-891', name: 'Kiplagat Kiprono', initials: 'KK', crop: 'Maize', location: 'Nakuru County', issue: 'Fall armyworm', specialist: 'Dr. Sarah Mwangi', status: 'Needs support' },
  { id: 'REC-2026-884', name: 'Grace Achieng', initials: 'GA', crop: 'Maize', location: 'Kisumu County', issue: 'Northern leaf blight', specialist: 'James Otieno', status: 'Assigned' },
  { id: 'REC-2026-872', name: 'Peter Mwangi', initials: 'PM', crop: 'Tomato', location: 'Kiambu County', issue: 'Early blight', specialist: 'Dr. Sarah Mwangi', status: 'Follow-up' },
  { id: 'REC-2026-861', name: 'Mary Wanjiku', initials: 'MW', crop: 'Beans', location: 'Nyeri County', issue: 'Aphid damage', specialist: 'Unassigned', status: 'Needs support' },
]

const initialVisits: OfficeVisit[] = [
  { id: 'VIS-204', farmer: 'Kiplagat Kiprono', farmerId: 'REC-2026-891', location: 'Nakuru County', date: '18 Nov', time: '10:00 AM', specialist: 'Dr. Sarah Mwangi', purpose: 'Crop health inspection', status: 'Confirmed' },
  { id: 'VIS-203', farmer: 'Grace Achieng', farmerId: 'REC-2026-884', location: 'Kisumu County', date: '18 Nov', time: '01:30 PM', specialist: 'James Otieno', purpose: 'Follow up on reported leaf damage', status: 'Awaiting confirmation' },
  { id: 'VIS-201', farmer: 'Peter Mwangi', farmerId: 'REC-2026-872', location: 'Kiambu County', date: '19 Nov', time: '09:00 AM', specialist: 'Dr. Sarah Mwangi', purpose: 'Field follow up', status: 'Confirmed' },
]

/** Sidebar destinations that let a coordinator move between office tasks. */
const navItems: { id: OfficeSection; label: string; icon: 'activity' | 'user' | 'calendar' | 'leaf' | 'cases' }[] = [
  { id: 'overview', label: 'Office overview', icon: 'activity' },
  { id: 'farmers', label: 'Farmer registry', icon: 'user' },
  { id: 'visits', label: 'Visits & support', icon: 'calendar' },
  { id: 'resources', label: 'Resources & schedules', icon: 'leaf' },
  { id: 'reports', label: 'Office reports', icon: 'cases' },
]

/**
 * Actions supplied by the app when it opens the agricultural office portal.
 * @property onSwitchPortal Returns to the specialist Command Centre dashboard.
 * @remarks `App.tsx` owns portal and specialist route selection.
 */
type OfficePortalProps = { onSwitchPortal: () => void }

/**
 * The agricultural office workspace for coordinating farmer support.
 * @param props The action that returns to the specialist dashboard.
 * @returns The office navigation, selected workspace, and visit scheduling dialog when open.
 * @remarks `App.tsx` renders this separate portal when the specialist selects Agricultural office.
 */
function OfficePortal({ onSwitchPortal }: OfficePortalProps) {
  const [section, setSection] = useState<OfficeSection>('overview')
  const [farmers, setFarmers] = useState(initialFarmers)
  const [officeVisits, setOfficeVisits] = useState(initialVisits)
  const [query, setQuery] = useState('')
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const scheduleButtonRef = useRef<HTMLButtonElement>(null)
  const [notice, setNotice] = useState('')
  const [completedVisits, setCompletedVisits] = useState<string[]>([])
  const [resourceRequestCount, setResourceRequestCount] = useState(0)

  // Keep the registry results matched to the global office search field.
  const filteredFarmers = useMemo(() => {
    const search = query.trim().toLowerCase()
    // With no search text, show every current demo record instead of an empty filtered list.
    if (!search) return farmers
    return farmers.filter((farmer) =>
      [farmer.name, farmer.id, farmer.crop, farmer.location, farmer.issue, farmer.specialist, farmer.status]
        .some((value) => value.toLowerCase().includes(search)),
    )
  }, [farmers, query])

  /**
   * Assigns the demo specialist to the selected farmer record.
   * @param farmerId The local case identifier for the farmer to assign.
   * @returns Nothing; it updates the local record and shows a confirmation notice.
   * @remarks The farmer detail panel calls this when its Assign specialist button is pressed.
   */
  const assignFarmer = (farmerId: string) => {
    setFarmers((current) => current.map((farmer) =>
      farmer.id === farmerId
        ? { ...farmer, specialist: 'Dr. Sarah Mwangi', status: 'Assigned' }
        : farmer,
    ))
    setNotice('A specialist has been assigned to this farmer in the prototype.')
  }

  /**
   * Closes the visit form and returns keyboard focus to the button that opened it.
   * @returns Nothing; it updates dialog state and restores focus to its trigger.
   * @remarks The dialog close button, Cancel action, Escape key, and backdrop use this helper.
   */
  const closeSchedule = () => {
    setScheduleOpen(false)
    scheduleButtonRef.current?.focus()
  }

  /**
   * Keeps keyboard navigation inside the visit dialog and handles its Escape key.
   * @param event The keyboard event from the scheduling form.
   * @returns Nothing; it moves focus at the dialog edges or closes the dialog.
   * @remarks This prevents Tab navigation from moving behind the open modal.
   */
  const handleScheduleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      closeSchedule()
      return
    }
    if (event.key !== 'Tab') return

    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)',
    ))
    const firstControl = controls[0]
    const lastControl = controls[controls.length - 1]
    if (!firstControl || !lastControl) return

    if (event.shiftKey && document.activeElement === firstControl) {
      event.preventDefault()
      lastControl.focus()
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault()
      firstControl.focus()
    }
  }

  /**
   * Adds a scheduled visit using the values entered in the office form.
   * @param event The form submit event, used to read fields and prevent page reload.
   * @returns Nothing; it saves the visit in local state and closes the dialog.
   * @remarks The office visit lists and counts render the new visit during this session.
   */
  const scheduleVisit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const farmer = farmers.find((item) => item.id === formData.get('farmer'))
    const visitDate = String(formData.get('date') ?? '')
    const visitTime = String(formData.get('time') ?? '')
    const specialist = String(formData.get('specialist') ?? '')
    // Browser validation normally catches missing values, but keep this guard for scripted submits too.
    if (!farmer || !visitDate || !visitTime || !specialist) {
      setNotice('Choose a farmer, date, time, and specialist before adding this visit.')
      return
    }

    const formattedDate = new Date(`${visitDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    // Office visit rows use a 12 hour clock, while the browser time input returns 24 hour time.
  const [hours, minutes] = visitTime.split(':').map(Number)
  const formattedTime = `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
    const visit: OfficeVisit = {
      id: `VIS-${Date.now()}`,
      farmer: farmer.name,
      farmerId: farmer.id,
      location: farmer.location,
      date: formattedDate,
      time: formattedTime,
      specialist,
      purpose: String(formData.get('purpose') ?? '').trim() || 'Farmer support visit',
      status: 'Awaiting confirmation',
    }
    setOfficeVisits((current) => [visit, ...current])
    closeSchedule()
    setNotice(`Visit for ${farmer.name} added to this demo office schedule.`)
  }

  /**
   * Opens an office section and clears selection-specific messages.
   * @param nextSection The office area selected in the sidebar or a page action.
   * @returns Nothing; it changes the visible section and clears the selected farmer.
   * @remarks Office navigation buttons and dashboard links use this handler.
   */
  const changeSection = (nextSection: OfficeSection) => {
    setSection(nextSection)
    setNotice('')
    setSelectedFarmer(null)
  }

  return (
    <div className="office-shell">
      {/* Persistent office identity, section navigation, and coordinator profile. */}
      <aside className="office-sidebar">
        <div className="office-brand">
          <div className="office-brand-mark"><Icon name="shield" /></div>
          <div><strong>CROP GUARD <span>AI</span></strong><small>AGRICULTURAL OFFICE</small></div>
        </div>
        <div className="office-station"><span className="office-station-icon"><Icon name="location" /></span><span><small>YOUR OFFICE</small><strong>Nakuru County Office</strong></span></div>
        <nav aria-label="Agricultural office navigation" className="office-nav">
          <span className="office-nav-label">OFFICE WORKSPACE</span>
          {navItems.map((item) => (
            <button
              aria-current={section === item.id ? 'page' : undefined}
              className={`office-nav-item${section === item.id ? ' office-nav-active' : ''}`}
              key={item.id}
              onClick={() => changeSection(item.id)}
              type="button"
            >
              <Icon name={item.icon} /><span>{item.label}</span>
              {item.id === 'farmers' && <b>4</b>}
            </button>
          ))}
        </nav>
        <div className="office-sidebar-bottom">
          <div className="office-online"><i /> Office services online</div>
          <div className="office-user"><div className="office-avatar">JO</div><span><strong>Janet Ochieng</strong><small>Office coordinator</small></span><Icon name="more" /></div>
        </div>
      </aside>

      {/* Search and the return action remain available while the coordinator changes sections. */}
      <main className="office-main">
        <header className="office-topbar">
          <label className="office-search">
            <Icon name="search" />
            <input aria-label="Search farmers, cases, crops or locations" onChange={(event) => setQuery(event.target.value)} placeholder="Search farmers, cases, crops or locations..." value={query} />
          </label>
          <div className="office-top-actions">
            <time className="office-date">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</time>
            <button aria-label="Back to specialist dashboard" className="office-switch" onClick={onSwitchPortal} type="button"><Icon className="office-back-arrow" name="chevron" /> Back to specialist dashboard</button>
          </div>
        </header>

        <div className="office-content">
          <div className="office-page-heading">
            <div>
              <span className="office-eyebrow"><i /> NAKURU COUNTY AGRICULTURAL OFFICE</span>
              <h1>{sectionTitle(section)}</h1>
              <p>{sectionDescription(section)}</p>
            </div>
            <div className="office-heading-actions">
              <span className="office-demo"><i /> Illustrative data</span>
              {(section === 'overview' || section === 'visits') && (
                <button className="office-primary-button" onClick={() => setScheduleOpen(true)} ref={scheduleButtonRef} type="button"><Icon name="calendar" /> Schedule a visit</button>
              )}
            </div>
          </div>

          {notice && <div className="office-notice" role="status">{notice}<button aria-label="Dismiss message" onClick={() => setNotice('')} type="button"><Icon name="close" /></button></div>}

          {/* Overview metrics and links summarize current local office data. */}
          {section === 'overview' && (
            <>
              <section aria-label="Office workload summary" className="office-stats">
                <OfficeStat label="Farmers in demo registry" value={String(farmers.length)} note="Illustrative farmer records" icon="user" tone="green" />
                <OfficeStat label="Cases needing support" value={String(farmers.filter((farmer) => farmer.status === 'Needs support').length)} note="From current demo records" icon="alert" tone="red" />
                <OfficeStat label="Upcoming field visits" value={String(officeVisits.length - completedVisits.length)} note="Current office schedule" icon="calendar" tone="blue" />
                <OfficeStat label="Demo specialists" value="2" note="1 available · 1 in the field" icon="activity" tone="amber" />
              </section>

              <div className="office-overview-grid">
                <section className="office-panel office-support-panel">
                  <PanelHeading title="Farmer support queue" subtitle="Requests that need office coordination" action="View farmer registry" onAction={() => changeSection('farmers')} count="4" />
                  <div className="office-farmer-list">
                    {farmers.slice(0, 3).map((farmer) => (
                      <FarmerRow farmer={farmer} key={farmer.id} onSelect={() => { setSelectedFarmer(farmer); setSection('farmers') }} />
                    ))}
                  </div>
                  <button className="office-bottom-link" onClick={() => changeSection('farmers')} type="button">Open farmer registry <span>→</span></button>
                </section>
                <section className="office-panel office-specialists-panel">
                  <PanelHeading title="Specialist availability" subtitle="Field team serving your area" />
                  <div className="specialist-availability">
                    <div className="specialist-avatar">SM<span /></div><div><strong>Dr. Sarah Mwangi</strong><small>Crop health · Maize & cereals</small></div><span className="availability-pill">Available</span>
                  </div>
                  <div className="specialist-availability">
                    <div className="specialist-avatar specialist-avatar-blue">JO<span /></div><div><strong>James Otieno</strong><small>Plant pathology · Lake region</small></div><span className="availability-pill availability-field">In the field</span>
                  </div>
                  <div className="office-area-card">
                    <div className="office-area-map"><span className="map-road road-one" /><span className="map-road road-two" /><i className="map-pin pin-one" /><i className="map-pin pin-two" /><i className="map-pin pin-three" /></div>
                    <div><small>LOCAL COVERAGE</small><strong>Nakuru · Naivasha · Gilgil</strong><span>3 active service areas</span></div>
                  </div>
                </section>
              </div>

              <section className="office-panel office-visits-preview">
                <PanelHeading title="Next field visits" subtitle="Coordinate logistics and follow-up with specialists" action="Manage visits" onAction={() => changeSection('visits')} />
                <VisitTable completedVisits={completedVisits} visits={officeVisits.slice(0, 2)} onComplete={(id) => setCompletedVisits((current) => [...current, id])} />
              </section>
            </>
          )}

          {/* The registry lets the coordinator find a demo farmer and open the detail panel. */}
          {section === 'farmers' && (
            <section className="office-panel office-directory">
              <PanelHeading title="Farmer registry" subtitle={`${filteredFarmers.length} farmer records · use search to find a person, case or location`} count={String(filteredFarmers.length)} />
              <div className="directory-header"><span>FARMER / CASE</span><span>CROP & ISSUE</span><span>LOCATION</span><span>SPECIALIST</span><span>STATUS</span><span /></div>
              {filteredFarmers.length ? filteredFarmers.map((farmer) => (
                <div className={`directory-row${selectedFarmer?.id === farmer.id ? ' directory-row-selected' : ''}`} key={farmer.id}>
                  <button className="directory-farmer" onClick={() => setSelectedFarmer(selectedFarmer?.id === farmer.id ? null : farmer)} type="button"><span className="farmer-initials">{farmer.initials}</span><span><strong>{farmer.name}</strong><small>{farmer.id}</small></span></button>
                  <span className="directory-crop"><strong>{farmer.crop}</strong><small>{farmer.issue}</small></span>
                  <span className="directory-location">{farmer.location}</span>
                  <span className="directory-specialist">{farmer.specialist}</span>
                  <span className={`office-status status-${farmer.status.toLowerCase().replaceAll(' ', '-')}`}>{farmer.status}</span>
                  <button aria-label={`View ${farmer.name} record`} className="directory-open" onClick={() => setSelectedFarmer(selectedFarmer?.id === farmer.id ? null : farmer)} type="button"><Icon name="chevron" /></button>
                </div>
              )) : <div className="office-empty">No farmer records match “{query}”. Try a name, crop, case ID or location.</div>}
              {selectedFarmer && (
                <div className="farmer-detail-panel">
                  <div><span className="office-eyebrow">FARMER CASE · {selectedFarmer.id}</span><h3>{selectedFarmer.name}</h3><p>{selectedFarmer.crop} · {selectedFarmer.issue} · {selectedFarmer.location}</p></div>
                  <div className="farmer-detail-facts"><span><small>Assigned specialist</small><strong>{selectedFarmer.specialist}</strong></span><span><small>Support status</small><strong>{selectedFarmer.status}</strong></span><span><small>Farm location</small><strong>{selectedFarmer.location}</strong></span></div>
                  <div className="farmer-detail-actions">
                    {selectedFarmer.status !== 'Assigned' && <button className="office-primary-button" onClick={() => assignFarmer(selectedFarmer.id)} type="button">Assign specialist</button>}
                    <button className="office-secondary-button" onClick={() => { setSection('visits'); setSelectedFarmer(null) }} type="button"><Icon name="calendar" /> Arrange field visit</button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Scheduled visits can be completed in this browser session. */}
          {section === 'visits' && (
            <div className="office-visits-layout">
              <section className="office-panel office-visits-panel">
                <PanelHeading title="Field visits & farmer support" subtitle="Review visit requests, coordinate specialists and record completion" count={String(officeVisits.length - completedVisits.length)} />
                <VisitTable completedVisits={completedVisits} visits={officeVisits} onComplete={(id) => setCompletedVisits((current) => [...current, id])} />
              </section>
              <section className="office-panel visit-checklist">
                <span className="office-eyebrow">FIELD SUPPORT FLOW</span>
                <h2>From farmer request to field support</h2>
                <div className="support-step"><b>01</b><span><strong>Review the farmer case</strong><small>Check crop, symptoms, image evidence and location.</small></span><i className="step-done"><Icon name="check" /></i></div>
                <div className="support-step"><b>02</b><span><strong>Assign a specialist</strong><small>Match the crop issue and service area to an available officer.</small></span><i className="step-done"><Icon name="check" /></i></div>
                <div className="support-step"><b>03</b><span><strong>Coordinate the visit</strong><small>Confirm timing, farmer contact and field logistics.</small></span><i className="step-current">3</i></div>
                <div className="support-step"><b>04</b><span><strong>Follow up & record outcome</strong><small>Track recommendations, resources and farmer progress.</small></span><i>4</i></div>
              </section>
            </div>
          )}

          {/* Resource requests and schedule entries are local prototype information. */}
          {section === 'resources' && (
            <div className="office-resources-grid">
              <section className="office-panel resource-panel">
                <PanelHeading title="Agricultural support resources" subtitle="Track office supplies and farmer service availability" />
                <ResourceRow title="Fall armyworm scouting guides" type="Printed field guides" available="42 copies" status="Available" />
                <ResourceRow title="Protective equipment kits" type="Field safety equipment" available="8 kits" status="Low stock" />
                <ResourceRow title="Maize IPM treatment reference" type="Specialist-approved guidance" available="Updated 02 Nov" status="Available" />
                <ResourceRow title="Soil testing referrals" type="Partner laboratory service" available="Next slot · 09 Nov" status="Scheduled" />
                <button className="office-secondary-button resource-action" onClick={() => { setResourceRequestCount((count) => count + 1); setNotice('Resource request recorded for office follow up in this demo session.') }} type="button">Request additional resources{resourceRequestCount ? ` (${resourceRequestCount} recorded)` : ''}</button>
              </section>
              <section className="office-panel schedule-panel">
                <PanelHeading title="Office schedule" subtitle="Upcoming coordination dates" />
                <div className="schedule-card"><span className="schedule-date"><b>18</b><small>NOV</small></span><span><strong>Field visit coordination</strong><small>{officeVisits.length} visits · Nakuru service area</small></span><span className="schedule-tag">Next day</span></div>
                <div className="schedule-card"><span className="schedule-date"><b>21</b><small>NOV</small></span><span><strong>Soil testing collection</strong><small>Naivasha partner laboratory</small></span><span className="schedule-tag schedule-tag-blue">Sat</span></div>
                <div className="schedule-card"><span className="schedule-date"><b>24</b><small>NOV</small></span><span><strong>Farmer training session</strong><small>Integrated pest management · demo schedule</small></span><span className="schedule-tag schedule-tag-green">Planned</span></div>
                <button className="office-bottom-link" onClick={() => changeSection('visits')} type="button">Open office calendar <span>→</span></button>
              </section>
            </div>
          )}

          {/* Report totals are derived from the office demo records. */}
          {section === 'reports' && (
            <section className="office-panel reports-panel">
              <PanelHeading title="Office service overview" subtitle="Illustrative service activity for the current month" />
              <div className="report-summary">
                <OfficeStat label="Farmers in registry" value={String(farmers.length)} note="Current demo records" icon="user" tone="green" />
                <OfficeStat label="Cases assigned" value={String(farmers.filter((farmer) => farmer.specialist !== 'Unassigned').length)} note="Assigned to demo specialists" icon="cases" tone="blue" />
                <OfficeStat label="Visits completed" value={String(completedVisits.length)} note="Completed this session" icon="check" tone="green" />
                <OfficeStat label="Open follow-ups" value={String(farmers.filter((farmer) => farmer.status === 'Needs support' || farmer.status === 'Follow-up').length)} note="Need office coordination" icon="clock" tone="amber" />
              </div>
              <div className="report-chart">
                <div className="report-chart-heading"><div><strong>Farmer support activity</strong><small>Cases received and visits completed · recent weeks</small></div><span className="report-legend"><i /> Cases <i className="legend-visits" /> Visits</span></div>
                <div className="chart-bars" aria-label="Illustrative weekly cases and visits chart">
                  {[['W1', 42, 27], ['W2', 62, 38], ['W3', 49, 31], ['W4', 78, 52]].map(([label, cases, completed]) => (
                    <div className="chart-week" key={label}><div className="chart-bar-pair"><i style={{ height: `${cases}%` }} /><i style={{ height: `${completed}%` }} /></div><small>{label}</small></div>
                  ))}
                </div>
              </div>
              <p className="office-report-note">Reports are illustrative and are not connected to a live agricultural database.</p>
            </section>
          )}

          <footer className="office-footer"><span>Crop Guard AI · Agricultural Office Workspace</span><span>Healthy crops · Better harvests · Brighter futures</span></footer>
        </div>
      </main>

      {/* The visit form creates an officeVisits entry when it passes browser validation. */}
      {scheduleOpen && (
        <div className="office-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSchedule() }}>
          <form aria-labelledby="schedule-title" aria-modal="true" className="office-modal" onKeyDown={handleScheduleKeyDown} onSubmit={scheduleVisit} role="dialog" tabIndex={-1}>
            <button aria-label="Close schedule form" className="office-modal-close" onClick={closeSchedule} type="button"><Icon name="close" /></button>
            <span className="office-eyebrow">OFFICE COORDINATION</span>
            <h2 id="schedule-title">Schedule a field visit</h2>
            <p>Coordinate a specialist visit with a farmer who needs on-site support.</p>
            <label>Farmer<select autoFocus defaultValue="" name="farmer" required><option disabled value="">Select a farmer</option>{farmers.map((farmer) => <option key={farmer.id} value={farmer.id}>{farmer.name} · {farmer.location}</option>)}</select></label>
            <div className="office-form-row"><label>Visit date<input min={new Date().toISOString().slice(0, 10)} name="date" required type="date" /></label><label>Time<input name="time" required type="time" /></label></div>
            <label>Assigned specialist<select defaultValue="" name="specialist" required><option disabled value="">Select a specialist</option><option>Dr. Sarah Mwangi</option><option>James Otieno</option></select></label>
            <label>Visit purpose<textarea name="purpose" placeholder="Inspection, treatment follow-up, farmer support..." rows={3} /></label>
            <div className="office-modal-actions"><button className="office-secondary-button" onClick={closeSchedule} type="button">Cancel</button><button className="office-primary-button" type="submit">Add to schedule</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

/**
 * Finds the heading for the currently selected office section.
 * @param section One of the five office navigation destinations.
 * @returns The short heading displayed above that section.
 * @remarks `OfficePortal` uses this helper to keep page titles consistent with navigation.
 */
function sectionTitle(section: OfficeSection) {
  return {
    overview: 'Agricultural Office Overview',
    farmers: 'Farmer registry & support',
    visits: 'Visits & field support',
    resources: 'Resources & schedules',
    reports: 'Office reports & activity',
  }[section]
}

/**
 * Finds the explanatory sentence for the currently selected office section.
 * @param section One of the five office navigation destinations.
 * @returns A plain-language description of the selected office task.
 * @remarks `OfficePortal` displays this below the section heading.
 */
function sectionDescription(section: OfficeSection) {
  return {
    overview: 'Coordinate farmer support, specialist field work and local agricultural resources.',
    farmers: 'Review farmer information, case status, location and specialist assignments.',
    visits: 'Coordinate on-site support from case review through field follow-up.',
    resources: 'Manage farmer support materials, local referrals and office activities.',
    reports: 'Monitor farmer support activity, referrals and field service delivery.',
  }[section]
}

/**
 * Inputs for a single agricultural office summary metric.
 * @property label The metric name shown above its value.
 * @property value The current local count or short measurement.
 * @property note A brief explanation of the value's source or time period.
 * @property icon An existing shared icon name for the metric.
 * @property tone The visual category used to color the icon.
 */
type OfficeStatProps = {
  label: string
  value: string
  note: string
  icon: 'user' | 'alert' | 'calendar' | 'activity' | 'cases' | 'check' | 'clock'
  tone: 'green' | 'red' | 'blue' | 'amber'
}

/**
 * Displays one summary number in the office overview or reports section.
 * @param props The metric label, value, note, icon, and color category.
 * @returns A styled office summary metric.
 * @remarks `OfficePortal` uses this for workload and activity counts.
 */
function OfficeStat({ label, value, note, icon, tone }: OfficeStatProps) {
  return <article className="office-stat"><div className="office-stat-top"><span>{label}</span><i className={`office-stat-icon tone-${tone}`}><Icon name={icon} /></i></div><strong className={tone === 'red' ? 'office-stat-red' : ''}>{value}</strong><small>{note}</small></article>
}

/**
 * Inputs for a reusable office panel heading and optional action.
 * @property title The panel name.
 * @property subtitle A short explanation of the panel's content.
 * @property action Optional action text; when omitted, no action button is shown.
 * @property onAction Optional callback used when the action button is pressed.
 * @property count Optional small count badge shown beside the title.
 */
type PanelHeadingProps = {
  title: string
  subtitle: string
  action?: string
  onAction?: () => void
  count?: string
}

/**
 * Displays a consistent heading row at the top of an office panel.
 * @param props The panel title, supporting text, optional count, and optional action.
 * @returns A heading row with a button only when an action callback is supplied.
 * @remarks Office overview, registry, visit, resource, and report panels reuse it.
 */
function PanelHeading({ title, subtitle, action, onAction, count }: PanelHeadingProps) {
  return <div className="office-panel-heading"><div><div className="office-panel-title"><h2>{title}</h2>{count && <span>{count}</span>}</div><p>{subtitle}</p></div>{action && onAction && <button onClick={onAction} type="button">{action} <b>→</b></button>}</div>
}

/** Inputs for a selectable farmer row in the office support queue. */
type FarmerRowProps = { farmer: Farmer; onSelect: () => void }

/**
 * Shows one farmer and opens that farmer's registry detail when selected.
 * @param props The illustrative farmer and the action for opening its detail.
 * @returns A full-width button with case, location, crop, issue, and status.
 * @remarks The office overview uses this for the support queue.
 */
function FarmerRow({ farmer, onSelect }: FarmerRowProps) {
  return <button className="office-farmer-row" onClick={onSelect} type="button"><span className="farmer-initials">{farmer.initials}</span><span className="office-farmer-copy"><strong>{farmer.name}<small>{farmer.id}</small></strong><span>{farmer.location} · {farmer.crop} · {farmer.issue}</span></span><span className={`office-status status-${farmer.status.toLowerCase().replaceAll(' ', '-')}`}>{farmer.status}</span><Icon name="chevron" /></button>
}

/** Inputs for rendering and completing a list of office field visits. */
type VisitTableProps = { visits: OfficeVisit[]; completedVisits: string[]; onComplete: (id: string) => void }

/**
 * Displays scheduled office visits and lets the coordinator mark a visit complete.
 * @param props The visits to show, completed visit identifiers, and completion callback.
 * @returns A horizontally scrollable table that also works on small screens.
 * @remarks The office overview and Visits section share this component.
 */
function VisitTable({ visits: rows, completedVisits, onComplete }: VisitTableProps) {
  return <div className="visit-table-wrap"><div className="visit-table-head"><span>FARMER & CASE</span><span>DATE & TIME</span><span>LOCATION</span><span>SPECIALIST</span><span>STATUS</span><span /></div>{rows.map((visit) => {
    const completed = completedVisits.includes(visit.id)
    return <div className="visit-table-row" key={visit.id}><span className="visit-farmer-cell"><strong>{visit.farmer}</strong><small>{visit.id} · {visit.purpose}</small></span><span className="visit-date-cell"><strong>{visit.date}</strong><small>{visit.time}</small></span><span>{visit.location}</span><span>{visit.specialist}</span><span className={`visit-state${completed ? ' visit-state-complete' : ''}`}>{completed ? 'Completed' : visit.status}</span><button aria-label={completed ? `${visit.farmer} visit completed` : `Mark ${visit.farmer} visit complete`} className="visit-row-action" disabled={completed} onClick={() => onComplete(visit.id)} type="button">{completed ? <Icon name="check" /> : 'Complete'}</button></div>
  })}</div>
}

/** Inputs describing one illustrative agricultural office resource. */
type ResourceRowProps = { title: string; type: string; available: string; status: string }

/**
 * Displays the name, category, availability, and status of one office resource.
 * @param props The resource details shown in the resources section.
 * @returns One compact office resource row.
 * @remarks `OfficePortal` uses this for its local illustrative resource list.
 */
function ResourceRow({ title, type, available, status }: ResourceRowProps) {
  return <div className="resource-row"><span className="resource-leaf"><Icon name="leaf" /></span><span className="resource-copy"><strong>{title}</strong><small>{type}</small></span><span className="resource-available"><strong>{available}</strong><small>Current availability</small></span><span className={`resource-status${status === 'Low stock' ? ' resource-low' : ''}`}>{status}</span></div>
}

export default OfficePortal
