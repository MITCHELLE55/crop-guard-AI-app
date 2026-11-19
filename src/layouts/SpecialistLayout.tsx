import { useState, type ReactNode } from 'react'
import Icon, { type IconName } from '../components/Icon'
import type { SpecialistSection } from '../portals/specialist/types'

/**
 * One button in the specialist sidebar navigation.
 * @property id The app section opened by this button.
 * @property label The visible name shown in the sidebar.
 * @property icon The decorative icon name used beside the label.
 * @property count An optional count badge, such as the number of cases.
 */
type NavigationItem = {
  id: SpecialistSection
  label: string
  icon: IconName
  count?: string
}

const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: 'Core modules',
    items: [
      { id: 'command-centre', label: 'Command Centre', icon: 'activity' },
      { id: 'consultation', label: 'Consultation Workspace', icon: 'user' },
      { id: 'cases', label: 'Farmer Cases', icon: 'cases', count: '3' },
      { id: 'intelligence', label: 'Notifications & Intel', icon: 'alert', count: '4' },
    ],
  },
  {
    label: 'Operations & field',
    items: [
      { id: 'visits', label: 'Farm Visit Ops', icon: 'calendar' },
      { id: 'treatments', label: 'Treatment Catalogue', icon: 'leaf' },
      { id: 'communication', label: 'Communication Hub', icon: 'chat' },
      { id: 'records', label: 'Interaction Records', icon: 'activity' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'reports', label: 'Reports & Analytics', icon: 'activity' },
      { id: 'settings', label: 'Profile & Settings', icon: 'user' },
    ],
  },
]

/**
 * Values and actions supplied to the specialist page frame.
 * @property activeSection The sidebar section currently selected.
 * @property onNavigate Opens the selected specialist section.
 * @property searchQuery The shared search field value.
 * @property onSearchChange Updates the shared search field value.
 * @property onOpenOfficeLogin Opens the separate agricultural office sign in page.
 * @property children The specialist page displayed beside the sidebar.
 * @remarks `App.tsx` provides these values around each specialist dashboard view.
 */
type SpecialistLayoutProps = {
  activeSection: SpecialistSection
  onNavigate: (section: SpecialistSection) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onOpenOfficeLogin: () => void
  children: ReactNode
}

/**
 * The shared frame around specialist pages.
 * @param props The selected section, shared search, office sign in action, and page content.
 * @returns A sidebar, top bar, and the specialist page supplied as children.
 * @remarks `App.tsx` wraps the command centre in this layout for specialist users.
 */
function SpecialistLayout({
  activeSection,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenOfficeLogin,
  children,
}: SpecialistLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  /**
   * Opens a sidebar destination and closes the mobile navigation drawer.
   * @param section The specialist section the user selected.
   * @returns Nothing; it calls the app navigation action and closes the drawer.
   * @remarks Each sidebar button uses this handler.
   */
  const navigate = (section: SpecialistSection) => {
    onNavigate(section)
    setMobileMenuOpen(false)
  }

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation"
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          type="button"
        />
      )}
      <aside className={`sidebar${mobileMenuOpen ? ' sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="shield" /></div>
          <div>
            <div className="brand-name">CROP GUARD <span>AI</span></div>
            <div className="brand-caption">SPECIALIST PORTAL</div>
          </div>
          <span className="brand-version">v2.4</span>
        </div>

        <div className="sidebar-divider" />
        {/* Group related specialist sections so the full workspace is easy to scan. */}
        <nav aria-label="Specialist navigation" className="sidebar-nav">
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-group-label">{group.label}</p>
              {group.items.map((item) => (
                <button
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`nav-item${activeSection === item.id ? ' nav-item-active' : ''}`}
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  type="button"
                >
                  <Icon className="nav-icon" name={item.icon} />
                  <span>{item.label}</span>
                  {item.id === 'consultation' && <span className="nav-tag">7-in-1</span>}
                  {item.count && <span className={`nav-count${item.id === 'intelligence' ? ' nav-count-alert' : ''}`}>{item.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sync-status"><span className="sync-dot" /> Online · Synced just now</div>
          <div className="sidebar-profile">
            <div className="avatar avatar-sidebar">SM</div>
            <div className="sidebar-profile-copy">
              <strong>Dr. Sarah Mwangi</strong>
              <span>Agricultural specialist</span>
            </div>
            <button aria-label="Open profile and settings" className="icon-button sidebar-more" onClick={() => onNavigate('settings')} type="button">
              <Icon name="more" />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button
            aria-label="Open navigation"
            className="icon-button mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            type="button"
          >
            <Icon name="menu" />
          </button>
          <label className="global-search">
            <Icon name="search" />
            <input
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search farmer, crop, case ID, or GPS location..."
              value={searchQuery}
            />
            <span className="search-shortcut">⌘ K</span>
          </label>
          <div className="topbar-actions">
            <button
              aria-label="Open agricultural office sign in"
              className="portal-switch"
              onClick={onOpenOfficeLogin}
              type="button"
            >
              Office sign in
              <Icon name="chevron" />
            </button>
            <div className="online-pill"><span /> Available</div>
            <div className="notification-wrap">
              <button
                aria-expanded={notificationsOpen}
                aria-label="Notifications"
                className="icon-button notification-button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                type="button"
              >
                <Icon name="alert" />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <strong>Notifications</strong>
                  <p><span className="notification-mark mark-red" /> Coordinator assignments and farmer reports are ready to review.</p>
                  <button className="text-button" onClick={() => { onNavigate('intelligence'); setNotificationsOpen(false) }} type="button">Open coordinator inbox <span>→</span></button>
                </div>
              )}
            </div>
            <div className="topbar-profile">
              <div className="avatar">SM</div>
              <div className="topbar-profile-copy">
                <strong>Dr. Sarah Mwangi</strong>
                <span>Senior Entomologist</span>
              </div>
              <Icon className="profile-chevron" name="chevron" />
            </div>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

export default SpecialistLayout
