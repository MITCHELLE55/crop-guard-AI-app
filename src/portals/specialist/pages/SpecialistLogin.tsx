/**
 * This page is the entry screen for agricultural specialists using Crop Guard AI.
 * Specialists see a farm photo and product introduction on the left, with a sign in form on the right.
 * They can enter an email and password to open the existing specialist workspace in local demo mode.
 * The page does not load or send data, and it does not store the form values.
 * Browser form checks handle missing or incorrectly formatted values; there are no network loading,
 * server error, or empty data states because no authentication service is connected.
 * It opens the specialist workspace through the callback supplied by the root application.
 */
import { type FormEvent } from 'react'
import coverImage from '../../../assets/login coverpage.jpg'
import Icon from '../../../components/Icon'
import './specialist-login.css'

/**
 * The one action the login screen needs from its parent component.
 * @property onSignIn Opens the specialist workspace after the form passes browser validation.
 * A typical value is a callback that changes the currently displayed screen.
 * @remarks This page does not receive or process credentials.
 */
interface SpecialistLoginProps {
  onSignIn: () => void
}

/**
 * Renders the branded, responsive agricultural specialist login experience.
 * It uses the project farm cover image and a local demo handoff instead of a real authentication request.
 * @param props The parent supplied sign in callback.
 * @returns The login page with its farm image, form, and demo access notice.
 * @remarks The root `App` component displays this page before either existing portal.
 */
function SpecialistLogin({ onSignIn }: SpecialistLoginProps) {
  /**
   * Lets the browser validate required fields, then opens the local demo workspace.
   * No input values are read, sent, or saved.
   * @param event The form submission event from the sign in form.
   * @returns Nothing; it prevents a page reload and calls the parent callback.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSignIn()
  }

  return (
    <main aria-labelledby="login-title" className="login-stage">
      <div aria-hidden="true" className="login-backdrop" />
      <section aria-label="Crop Guard AI specialist sign in" className="login-card">
        {/* The photo and product message introduce the agricultural specialist workspace. */}
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
            <p className="login-eyebrow"><span /> BUILT FOR THE PEOPLE WHO GROW</p>
            <h1 id="login-title">Agricultural Specialist Login</h1>
            <p className="login-intro">
              Bring crop intelligence, farmer cases, and field work together in one clear workspace.
            </p>
            <ul aria-label="Specialist workspace capabilities" className="login-capabilities">
              <li><Icon name="leaf" /> Crop health guidance</li>
              <li><Icon name="cases" /> Connected farmer cases</li>
              <li><Icon name="calendar" /> Field visit coordination</li>
            </ul>
          </div>
          <p className="login-photo-caption">Clear insight for healthier harvests.</p>
        </div>

        {/* The form collects no credentials; submitting it only opens this app's local demo workspace. */}
        <div className="login-panel">
          <div className="login-panel-content">
            <div className="login-panel-heading">
              <p className="login-eyebrow login-panel-eyebrow">SPECIALIST PORTAL</p>
              <h2>Welcome back</h2>
              <p>Sign in to continue to your agricultural workspace.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="specialist-email">Work email</label>
                <input
                  autoComplete="username"
                  id="specialist-email"
                  name="email"
                  placeholder="you@organization.org"
                  required
                  type="email"
                />
              </div>
              <div className="login-field">
                <label htmlFor="specialist-password">Password</label>
                <input
                  autoComplete="current-password"
                  id="specialist-password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </div>
              <button className="login-submit" type="submit">
                <span>Continue to workspace</span>
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
          </div>
          <footer className="login-panel-footer">
            <span>Crop Guard AI</span>
            <span>Specialist access</span>
          </footer>
        </div>
      </section>
      <p className="login-stage-footer">Practical crop intelligence, grounded in the field.</p>
    </main>
  )
}

export default SpecialistLogin
