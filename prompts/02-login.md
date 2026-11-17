# Crop Guard AI — Specialist Login Prompt

## Design inspiration

Use the supplied reference as a visual cue for a polished, premium login experience with a strong field-first identity. The layout should feel like a calm operations dashboard, not a generic marketing sign-in screen.

- Split the screen into two clear columns: a photographic farm panel on the left and a focused sign-in panel on the right.
- Keep the image dark and atmospheric, using the supplied farm photo with a subtle green overlay so the text remains readable and the panel feels branded.
- Use a deep forest green and warm neutral palette: dark green panels, soft cream surfaces, muted sage accents, and charcoal typography.
- Add crisp typography, generous spacing, and subtle shadows to create a clean, confident agricultural-product feel.
- Keep the overall composition framed and premium, with calm contrast and a strong sense of trust and clarity.

## Task

**Title:** Create the agricultural specialist login page

**Portal:** Specialist

**Objective:** Build a polished, responsive sign-in experience for agricultural specialists. Use the supplied farm photograph and the visual language of the login reference as the main design inspiration while keeping the product aligned with Crop Guard AI’s specialist workflow.

## Product context

Crop Guard AI is a React, TypeScript, and Vite frontend for agricultural support. The app includes a specialist portal and an agricultural office portal. Farmer-facing journeys are outside this repository.

**User and scenario:** An agricultural specialist is opening the specialist workspace for case review and field operations.

**Entry point:** The application entry screen, before the existing specialist workspace.

## Scope

### Include

- A branded login page with a farm image panel and a sign-in form.
- The heading “Agricultural Specialist Login.”
- Labeled email and password fields with browser validation for required values and email format.
- Responsive layouts, keyboard access, and visible focus states.
- A clear notice that sign-in is demo only and does not check, send, or save credentials.
- A demo submission flow that opens the existing specialist workspace.

### Exclude

- Real authentication providers, session handling, or credential storage.
- Sending or persisting form values.
- Farmer-facing screens, routes, or workflows.
- Changes to the agricultural office workflow.

## User workflow

1. The specialist opens the application and sees the login screen.
2. They enter a work email and password into the form.
3. The browser validates the required fields and checks that the email format is correct.
4. On a valid submission, the app opens the existing specialist workspace in local demo mode.

**Important edge cases:** Invalid or missing form values remain on the login screen and are rejected by the browser. The demo does not verify that the credentials are real.

## Functional requirements

- Show the page title “Agricultural Specialist Login” in the page heading and browser tab.
- Use `src/assets/login coverpage.jpg` as the primary image in the left-hand panel.
- Keep form values local to the browser and do not read, submit, or persist them.
- Preserve the existing specialist workspace and navigation after demo sign-in.
- Keep the login experience readable and usable on narrow-width screens and with keyboard-only navigation.

## Data and integration boundaries

- No data is loaded or sent by the login screen.
- Do not add authentication services, endpoints, or credential storage.
- Clearly label the sign-in flow as a local prototype.

## UI and UX direction

- Follow the supplied reference: a framed, dark green split layout with a photographic introduction and a separate form card.
- Use the existing farm image, Crop Guard AI branding, and the project’s green visual language.
- Keep the heading, labels, and demo notice clear and readable.
- Use semantic form elements, visible keyboard focus, and responsive styling.
- Treat the login screen as a clean product shell, not as a marketing page or social sign-in experience.

## Implementation guidance

- Keep the page in `src/portals/specialist/pages/`.
- Reuse the existing icon component and project design tokens where practical.
- Do not add dependencies.
- Clearly document that authentication is not connected.

**Likely files:** `src/App.tsx`, `src/index.css`, `src/portals/specialist/pages/SpecialistLogin.tsx`, and `src/portals/specialist/pages/specialist-login.css`.

## Acceptance criteria

- The application opens to an agricultural specialist login screen.
- The page heading and browser title identify it as “Agricultural Specialist Login.”
- The login screen uses the supplied `login coverpage.jpg` asset.
- The email and password fields have persistent labels and browser validation.
- Submitting valid form values opens the existing specialist workspace in demo mode.
- The screen clearly states that credentials are not checked, sent, or saved.
- The page works at desktop and mobile widths and is usable with keyboard navigation.
- No real authentication, credential storage, backend implementation, or farmer-facing workflow is added.
- The production build passes. Report unrelated lint or tooling blockers separately.

## Deliverables

- Implement the login page in the existing application.
- Summarize the changed files and the resulting behavior.
- Report the build, lint, and browser checks that were run.

## Additional notes

The login reference is visual inspiration only; it is not a request to reproduce unrelated sign-up or social-login features. The supplied farm photo is the image to use and should remain the main visual anchor.
