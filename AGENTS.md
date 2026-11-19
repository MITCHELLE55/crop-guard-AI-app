# AGENTS.md — Crop Guard AI

Crop Guard AI: a Vite based React + TypeScript single page frontend for a multi portal agricultural support tool. This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Stack

- React 19
- TypeScript
- Vite
- Vite based React frontend for a multi portal agricultural support tool

## Build approach

Keep the app as a Vite based React frontend with portal centric screens under `src/portals/`. Shared UI primitives live in `src/components/` and shared layouts in `src/layouts/`. `src/services/` is the integration boundary for API work; prototype data stays local until a backend exists.

**Scope: two portal experiences only.** The specialist portal and the agricultural office portal. There is no farmer portal; farmer-facing journeys are handled elsewhere and are out of scope for this repo. The current runnable experience is the specialist command centre and consultation workspace. The agricultural office portal is scaffolded as a separate future workstream, not yet connected to live data.

## Agent workflow

Read this file and the nearest nested context before any work, and keep it current. Every development task runs through the applicable workflow skills. Inspect the project directory for installed skills, identify all available skills and their descriptions, locate and read the relevant `SKILL.md` files, and apply their recommendations throughout implementation. Skills-first development is mandatory, not optional.

Do not assume a skill is installed because it was requested. If a relevant skill cannot be found, report that it is unavailable, do not pretend to have consulted it, and apply established development best practices.

| Development task | Relevant skills |
| --- | --- |
| JavaScript / TypeScript | JavaScript and TypeScript skills |
| React | React skills |
| Component architecture | Architecture and design pattern skills |
| State management | State management skills |
| API integration | API and data-fetching skills |
| UI/UX implementation | UI/UX and frontend design skills |
| Styling | CSS and styling skills |
| Performance optimisation | Performance skills |
| Debugging | Debugging and troubleshooting skills |
| Testing | Testing skills |
| Security | Application security skills |
| Refactoring | Clean code and refactoring skills |

This table is a guide, not an exhaustive list. Always inspect the actual installed skills. If multiple skills apply, consult all of them before implementation. If skill instructions conflict: follow higher-priority project instructions first, then applicable skill-specific instructions, then established industry best practices, and explain unresolved conflicts before proceeding.

When new skills become available, discover them, read their `SKILL.md`, identify their intended use cases, and incorporate them into future relevant tasks. Do not assume previously consulted skills cover newly introduced functionality. Do not modify installed skill files unless explicitly requested.

A one line fix, a copy tweak, or a question needs no stage. Say which skill you skipped and why instead of silently skipping the process.

## Commands

npm run dev          # start the Vite dev server for local iteration
npm run build        # produce the production bundle
npm run preview      # preview the production build locally
npm run lint         # run the configured linter (when present in package.json)
npx tsc --noEmit     # type-check without emitting files

## Who owns what

Each external concern has exactly one owner. The frontend consumes documented contracts and never replaces them.

- **Authentication and sessions:** the configured identity provider or API is authoritative for identity, sessions, and authorisation. The frontend implements only the client-side sign-in experience and session handling the approved integration supports. Expired sessions and authorisation errors are handled safely in the client; server-side enforcement is never reimplemented in components or services. Development demo sign-in may use local mock identity data, must be labelled as demo, and never sends or stores credentials.
- **Farmer records, farm details, case history, preferences:** read and written only through approved API contracts, only for the specialist or agricultural office user authorised to view them. The frontend never creates or manages their server-side persistence.
- **Media and uploads:** the frontend selects files and sends them through the approved upload contract. Upload authorisation, validation, storage, access, retention, and deletion are the server's job. Until an upload contract exists, selected files remain in local component state and are clearly labelled as unsaved.
- **Diagnosis and treatment rendering:** rendered from the documented response or status contract to show a result, request new evidence, or explain that specialist review is needed. No inference or disease-classification logic lives in the app. Any `/diagnose` prototype uses labelled local-only fixtures; selected images and notes remain in screen memory and are not uploaded or saved.
- **Case assignment, messages, advice, visit status:** rendered as returned by the approved external service. The frontend never invents assignment or authorisation.
- **Notifications:** the external notification or API service owns authoritative notification state. The frontend handles delayed, duplicated, or missed delivery without treating its own cache as truth.
- **Support offices and agricultural offices:** nearby office information and office-side workflows come from the external service; the frontend only displays it and initiates requests through the documented contract.

## Rules

- **Two portals only.** The app contains exactly two portal experiences: the specialist portal and the agricultural office portal. No farmer portal, farmer-facing route, screen, navigation, or workflow is ever added.
- **Frontend-only implementation.** No backend folders, server entry points, endpoint handlers, database models/migrations, AI inference code, or infrastructure config.
- **When the UI needs data:** check whether a documented API contract exists; if it does, implement it behind `src/services/`; if it does not, isolate the integration behind a typed service interface and use clearly labelled mocks for UI-only work. Never call external endpoints directly from a component.
- **Missing contract:** don't invent an endpoint and don't build a backend. Use labelled mocks that stay out of production flows, and introduce real farmer record handling behind the service layer rather than directly in components.
- **No direct infrastructure access.** The app never connects to a database, private object store, or privileged AI service.
- **No assumptions about providers.** Backend framework, database engine, AI framework, hosting, maps, and notification providers are not this repo's decisions.
- **HTTPS/TLS** for all configured API requests outside local development.
- **Server-side validation is the server's.** Client-side checks exist for user feedback only.
- **Never trust client state for identity.** A role, user ID, or ownership claim supplied only by client state is not authorisation.
- **Never unnecessarily recreate existing functionality, replace working implementations without a valid reason, or introduce architectural changes without understanding their impact.** Examine the existing project structure, implementation, reusable components, utilities, dependencies, conventions, and file dependencies before changing anything.
- **No dependency without justification.** Avoid unnecessary packages and document the reason in the report.
- **All prompt documents live in `prompts/`.** Never place prompt files in the project root or ad hoc folders. Prompt files use zero-padded numeric names in the format `NN-name.md` (for example `01-template.md` and `02-login.md`). The newest prompt always has the highest number.

## Beginner-facing code explanation

The human reviewing this work is a beginner who needs to understand what every function and page does. Code explanation is a first-class deliverable, not an afterthought. This section adds to the rules above; it does not remove any of them.

- **TSDoc for every function and component.** Every exported (and every non-trivial internal) function, React component, custom hook, and type has a TSDoc block written for a beginner covering: what it is in one plain-English sentence; what it does; every parameter with its purpose, a typical value, and the behaviour when omitted; what it returns and what that means to the caller; why it exists and where it is called from; and a minimal usage example where helpful. Write for someone who has never seen the file. Define domain terms ("case", "triage", "assignment") the first time they appear in that file.
- **Inline comments for non-obvious logic.** Explain what each non-obvious step does and why: branching logic and guards in plain English; loops and array transformations; async work, side effects, state updates, and effect dependencies; error handling and fallbacks; every magic number, timeout, retry count, and hardcoded key with its origin. No noise comments that merely restate the code.
- **Page-level explanation.** Every page/screen file (anything under `src/portals/`) has a top-of-file block comment covering: what the page is in one sentence; who uses it (specialist, agricultural office, or both); what the user sees as a bullet list of the main sections and what each is for; what the user can do here; what data it loads or sends (which service functions, and explicitly whether local mock data is used); what loading, error, and empty states it handles and what the user sees in each; and how it connects to other pages. Each major section, panel, or logical region inside the page has a short comment above it explaining what that region is responsible for.
- **Report every file.** Every file added or changed is listed in the Report with a beginner-friendly description of what it now does and, for code files, a one-line summary of each function, hook, or component it contains.
- **Ask instead of guess.** If the purpose of an existing function or page is genuinely unclear, do not silently invent a purpose in the comment. Note the uncertainty in the Report so the human can clarify.
- **Scope.** This applies to all code the agent adds or modifies. Existing code that lacks beginner-facing comments is not retroactively commented unless it is being modified as part of the current task, in which case the comments are added as it is touched. This section does not authorise rewriting unrelated files.

## Implementation standards

All generated and modified code prioritises:

- **Code quality:** clean, readable, maintainable code; modular reusable components; separation of concerns; consistent naming; appropriate error handling; minimal duplication.
- **Documentation:** meaningful comments for important decisions, documented functions and subfunctions, explained complex logic, documented reusable components and responsibilities, and consistency between documentation and implementation. Follow the beginner-facing explanation rules above.
- **Performance:** avoid unnecessary rendering and dependencies, optimise expensive operations, follow framework-specific recommendations.
- **Security:** validate inputs on the client for user feedback only (server-side validation stays authoritative); handle sensitive information appropriately; avoid exposing secrets; follow secure coding practices; never trust client state for identity.

## Definition of done

- Every screen that loads data handles loading, error, and empty states.
- Image and file upload flows validate inputs on the client and handle API failures and retries safely.
- Frontend session handling, authorisation-error handling, and record-ownership boundaries are tested against available API contracts or controlled mocks.
- Every exported function, hook, component, and type added or changed has beginner-facing TSDoc, and non-obvious logic has an inline comment explaining what and why.
- Every page/screen file added or changed has the top-of-file block comment and per-section comments described above.
- Every file added or changed is listed in the Report with a beginner-friendly description and, for code files, a one-line summary of each function, hook, or component.
- No hardcoded farmer data, credentials, or privileged endpoints appear in components; all integration passes through `src/services/`.
- No farmer portal, farmer-facing screens, navigation, or workflows are added.

## How we build features

1. **Understand.** Understand the requested functionality, inspect the relevant existing files, and identify project constraints.
2. **Discover skills.** Inspect installed skills, read applicable `SKILL.md` files, and extract relevant implementation requirements.
3. **Plan.** Identify affected files and reusable components, establish the implementation approach, and identify potential risks. If requirements are ambiguous, stop and ask for clarification before making architectural assumptions.
4. **Build.** Follow the applicable skills and existing architecture, write clean modular code with beginner-facing TSDoc, inline comments, and page-level explanations, and keep all API work behind `src/services/`.
5. **Verify.** Run `npm run build` and `npx tsc --noEmit`, resolve errors, confirm existing functionality remains intact, confirm implementation follows applicable skill instructions, and confirm every new or changed function, hook, component, and page carries the required beginner-facing comments.
6. **Report.** Provide the report described below.

## Reporting

End every piece of work that changes code with this report:

- **Done:** one line on the outcome, then the files changed and what changed in each. For every changed file, include a beginner-friendly description of what the file does and, for code files, a one-line summary of each function, hook, or component it contains.
- **Verified:** each check with ✅ or ❌ and its evidence. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take (keys, assets, backend contracts).
- **Test it yourself:** numbered steps from a fresh start, ending with `Expected:`.
- **Notes:** defaults picked, trade-offs, dependencies introduced and why, and anything left for later.

## Checks

- Screens that load data handle loading, error, and empty states.
- Upload flows validate on the client and handle API failure and retry.
- Session expiry and authorisation errors are handled without leaking farmer-owned data.
- No direct database, object-store, or privileged AI access exists anywhere in the app.
- No new dependency is introduced without justification in the report.
- No prompt document is created outside `prompts/`.
- No farmer portal or farmer-facing route, screen, or workflow is introduced.
- Every new or changed function, hook, component, and page has beginner-facing comments as defined above.
- The Report lists every changed file with a beginner-friendly description of what it does.

## Agent restrictions

The agent MUST NOT: ignore relevant installed skills; skip reading applicable skill instructions; claim to have followed skills it has not consulted; install unnecessary packages without justification; introduce unrelated functionality; make assumptions about unspecified requirements; rewrite unrelated project files; violate existing project conventions without justification; sacrifice maintainability for implementation speed; invent an API endpoint or build a backend when a contract is missing; connect the app directly to a database, private object store, or privileged AI service; add a farmer portal, farmer-facing screens, navigation, or workflows; leave a new or modified function, hook, component, or page without the required beginner-facing comments; or describe a file's purpose in the Report using jargon a beginner would not understand. If requirements are ambiguous, ask for clarification before making architectural assumptions.

## Final rule

**Every implementation must be skills-informed, architecture-aware, maintainable, beginner-explainable, and verified.** The objective is not merely to generate working code, but to produce reliable, scalable, secure, professionally maintainable software that a beginner can read and understand.
