/**
 * This page is the separate sign in screen for agricultural office coordinators.
 * Who uses it: agricultural office coordinators.
 * What the user sees:
 * - An agricultural support photo and office workspace introduction on the left.
 * - A work email and password form, a demo access note, and a specialist sign in link on the right.
 * What the user can do: submit the form to open the office demo workspace or go to `/specialist/login`.
 * Data: this page does not load or send data and does not store form values.
 * States: browser form checks cover required fields; no network loading, server error, or empty data state
 * is needed because a real authentication service is not connected.
 * Connections: coordinators enter at `/office/login`; a successful demo submission opens `/office`.
 */
import { type FormEvent } from 'react'
import coverImage from '../../../assets/login coverpage.jpg'
import Icon from '../../../components/Icon'
import '../../specialist/pages/specialist-login.css'

/**
 * The action the office sign in page needs from its parent component.
 * @property onSignIn Opens the office demo workspace after the browser checks the required fields.
 * A typical value is a callback that changes the current app path.
 */
interface OfficeLoginProps {
  onSignIn: () => void
}

/**
 * Shows the agricultural office sign in page.
 * It reuses the specialist sign in page's styling while showing office specific copy and navigation.
 * @param props The parent supplied action for opening the office demo workspace.
 * @returns The office sign in page with its introduction, form, prototype note, and specialist sign in link.
 * @remarks `App` displays this page at `/office/login`, then handles the local demo sign in callback.
 */
function OfficeLogin({ onSignIn }: OfficeLoginProps) {
  /**
   * Lets the browser validate the fields, then opens the local office demo workspace.
   * No entered value is read, sent, or saved.
   * @param event The form submission event created when the coordinator submits the sign in form.
   * @returns Nothing; it prevents a page reload and calls the parent action.
   * @remarks The sign in form uses this handler because no authentication service is connected.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSignIn()
  }

  return (
    <main aria-labelledby="office-login-title" className="login-stage">
      <div aria-hidden="true" className="login-backdrop" />
      <section aria-label="Crop Guard AI agricultural office sign in" className="login-card">
        {/* The photo and message explain the office team's role in agricultural support. */}
        <div className="login-story">
          <img
            alt=""
            aria-hidden="true"
            className="login-cover-image"
            src={coverImage}
          />
          <div className="login-story-shade" />
          <div className="login-brand">
            <span className="login-brand-mark"><Icon name="shield" /></span>
            <span className="login-brand-copy">
              <strong>CROP GUARD <span>AI</span></strong>
              <small>AGRICULTURAL INTELLIGENCE</small>
            </span>
          </div>
          <div className="login-story-copy">
            <p className="login-eyebrow"><span /> SUPPORTING STRONGER LOCAL AGRICULTURE</p>
            <h1 id="office-login-title">Agricultural Office Portal</h1>
            <p className="login-intro">
              Coordinate local farmer support, field visits, and specialist resources from one office workspace.
            </p>
            <ul aria-label="Agricultural office workspace capabilities" className="login-capabilities">
              <li><Icon name="user" /> Farmer support registry</li>
              <li><Icon name="cases" /> Specialist coordination</li>
              <li><Icon name="calendar" /> Field visit planning</li>
            </ul>
          </div>
          <p className="login-photo-caption">Local coordination for healthier harvests.</p>
        </div>

        {/* The form only opens the local office demo and never handles real credentials. */}
        <div className="login-panel">
          <div className="login-panel-content">
            <div className="login-panel-heading">
              <p className="login-eyebrow login-panel-eyebrow">AGRICULTURAL OFFICE PORTAL</p>
              <h2>Office coordinator sign in</h2>
              <p>Sign in to continue to your county office workspace.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="office-email">Work email</label>
                <input
                  autoComplete="username"
                  id="office-email"
                  name="email"
                  placeholder="you@organization.org"
                  required
                  type="email"
                />
              </div>
              <div className="login-field">
                <label htmlFor="office-password">Password</label>
                <input
                  autoComplete="current-password"
                  id="office-password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </div>
              <button className="login-submit" type="submit">
                <span>Continue to office workspace</span>
                <Icon name="chevron" />
              </button>
            </form>

            <p className="login-demo-note" role="note">
              <Icon name="shield" />
              <span>
                <strong>Prototype access</strong>
                This demo does not check, send, or save your sign in details.
              </span>
            </p>
            <a className="login-portal-link" href="/specialist/login">
              Specialist? Sign in to the specialist portal
            </a>
          </div>
          <footer className="login-panel-footer">
            <span>Crop Guard AI</span>
            <span>Agricultural office access</span>
          </footer>
        </div>
      </section>
      <p className="login-stage-footer">Practical crop intelligence, grounded in the field.</p>
    </main>
  )
}

export default OfficeLogin
