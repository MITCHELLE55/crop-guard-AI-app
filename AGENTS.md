# AGENTS.md — Crop Guard AI

## Stack

- React 19
- TypeScript
- Vite
- Single page frontend for a multi portal agricultural support tool

## Build approach

- Keep the app as a Vite based React frontend with portal centric screens under `src/portals/`
- Put shared UI primitives in `src/components/` and shared layouts in `src/layouts/`
- Treat `src/services/` as the integration boundary for API work and keep prototype data local until a backend exists
- Use `npm run dev` for local iteration and `npm run build` for the production bundle

## Commands

npm run dev          # start the Vite dev server for local iteration
npm run build        # produce the production bundle
npm run preview      # preview the production build locally
npm run lint         # run the configured linter (when present in package.json)
npx tsc --noEmit     # type-check without emitting files

## Project context

- The current runnable experience is the specialist command centre and consultation workspace
- The agricultural office portal is scaffolded as a separate future workstream, not yet connected to live data
- The app is intentionally split into exactly two portal experiences: the specialist portal and the agricultural office portal. There is no farmer portal; farmer-facing journeys are handled elsewhere and are out of scope for this repo
- The UI uses illustrative data only, so any real farmer record handling should be introduced behind the service layer rather than directly in components
- All new prompt documents must live in the `prompts/` folder. Do not place prompt files in the project root or in ad hoc folders
- Prompt files in `prompts/` use zero-padded numeric names in the format `NN-name.md` (for example `01-template.md` and `02-login.md`). The newest prompt always has the highest number.

## 0. Beginner-Facing Code Explanation Requirement (CRITICAL — READ FIRST)

The human reviewing this work is a **beginner**. They need to understand what every function and every page in the codebase is doing. Therefore, the AI agent MUST treat code explanation as a first-class deliverable, not an afterthought.

**This section takes precedence for all explanation and commenting behaviour. It does not replace or remove any existing rule below — it adds to them.**

### 0.1 Required TSDoc for every function and component

Every exported (and every non-trivial internal) function, React component, custom hook, and type MUST have a TSDoc block written for a beginner. Each TSDoc block MUST contain:

- **What it is** — one plain-English sentence describing the thing in beginner terms (e.g. "A button that opens the upload dialog.", not "Upload trigger primitive.").
- **What it does** — a short description of the behaviour in plain language.
- **Parameters** — every parameter, what it is for, and what a typical value looks like. If a parameter is optional, say what happens when it is omitted.
- **Returns** — what it returns and what that means to the caller.
- **Why it exists / where it is used** — one sentence on the purpose in the app and where it is called from.
- **Example (when helpful)** — a minimal usage snippet for non-obvious functions, hooks, or components.

Write for someone who has never seen the file before. Avoid unexplained jargon. If a domain term (e.g. "case", "triage", "assignment") is used, define it the first time it appears in that file.

### 0.2 Required inline comments for non-obvious logic

Inside function bodies, every non-obvious step MUST have an inline comment explaining **what** the line does and **why** it is needed. Specifically:

- Branching logic (`if` / `else`, guards, early returns) — explain the condition in plain English.
- Loops and array transformations — explain what is being iterated and why.
- Async work, side effects, state updates, and effect dependencies — explain what triggers them and what they change.
- Error handling and fallbacks — explain what can fail and what the code does about it.
- Any magic number, timeout, retry count, or hardcoded key — explain where it comes from.
- Anything a beginner would reasonably ask "why is this here?" about.

Do not add noise comments that merely restate the code (`// increment i`). Comments must add understanding.

### 0.3 Required page-level explanation

Every page/screen file (for example anything under `src/portals/`) MUST include a top-of-file block comment that explains, in beginner terms:

- **What this page is** — the purpose of the screen in one sentence.
- **Who uses it** — the specialist user, the agricultural office user, or both.
- **What the user sees** — a short bullet list of the main sections, panels, or controls on the screen and what each one is for.
- **What the user can do here** — the key actions available on the page (e.g. review a case, request evidence, open a consultation).
- **What data it loads or sends** — which service functions it calls and, in plain words, what it fetches or submits. If it uses local mock data, say so explicitly.
- **What states it handles** — loading, error, and empty states, and what the user sees in each.
- **How it connects to other pages** — where the user came from and where actions take them next.

Each major section, panel, or logical region inside the page file MUST also have a short comment above it explaining what that region is responsible for, so a beginner can scan the file and follow the layout.

### 0.4 Required explanation of every file in the report

Every file added or changed in a piece of work MUST be listed in the **Report** (see Reporting) with a beginner-friendly description of what that file now does and, for code files, a one-line summary of each function, hook, or component it contains. This is in addition to the normal "what changed" note.

### 0.5 When to ask instead of guess

If the purpose of an existing function or page is genuinely unclear, do not silently invent a purpose in the comment. Note the uncertainty in the Report so the human can clarify.

### 0.6 Scope

This requirement applies to all code the agent adds or modifies from now on. Existing code that already lacks beginner-facing comments does not need to be retroactively commented unless it is being modified as part of the current task — in that case, add the comments as you touch it. **This section does not authorise rewriting unrelated files.**

---

## 1. Core Development Principle

You MUST use installed Agent Skills as your primary source of specialized development knowledge and implementation guidance.

All development activities must follow the relevant installed skills, established project architecture, coding standards, and best practices.

**Skills-first development is mandatory, not optional.**

Before implementing any feature, modifying existing code, or designing an application architecture, identify and consult the relevant installed skills.

## 2. Mandatory Skills Discovery

Before starting any development task:

1. Inspect the project directory for installed skills.
2. Identify all available skills and their descriptions.
3. Locate and read the relevant `SKILL.md` files.
4. Understand the instructions, workflows, constraints, and standards defined by those skills.
5. Select the skills applicable to the requested task.
6. Apply their recommendations throughout implementation.

Do not assume that a skill is installed simply because it was requested.

If a relevant skill cannot be found:
- Report that it is unavailable.
- Do not pretend to have consulted it.
- Apply established development best practices where appropriate.

## 3. Skills Compliance

When working on a task, you MUST:

- Follow the instructions defined in the relevant `SKILL.md` files.
- Respect the recommended development workflows.
- Use the recommended design patterns and architectural approaches.
- Follow the prescribed coding conventions.
- Apply recommended security and performance practices.
- Use recommended libraries and tools when appropriate.
- Avoid introducing unnecessary dependencies.
- Maintain consistency with existing project architecture.

If multiple skills apply, consult all relevant skills before implementation.

If skill instructions conflict:
1. Follow the higher-priority project instructions.
2. Follow applicable skill-specific instructions.
3. Prefer established industry best practices.
4. Explain unresolved conflicts before proceeding.

## 4. Skill Selection by Development Task

Select skills according to the nature of the task.

| Development Task | Relevant Skills |
|---|---|
| JavaScript development | JavaScript skills |
| TypeScript development | TypeScript skills |
| React development | React skills |
| React Native development | React Native skills |
| Expo development | Expo skills |
| Component architecture | Architecture and design pattern skills |
| State management | State management skills |
| API integration | API and data-fetching skills |
| UI/UX implementation | UI/UX and frontend design skills |
| Styling | CSS and styling skills |
| Performance optimization | Performance skills |
| Debugging | Debugging and troubleshooting skills |
| Testing | Testing skills |
| Security | Application security skills |
| Code refactoring | Clean code and refactoring skills |

This table is a guide, not an exhaustive list. Always inspect the actual installed skills.

## 5. Existing Codebase Awareness

Before making changes:

- Examine the existing project structure.
- Understand the existing implementation.
- Identify reusable components and utilities.
- Inspect existing dependencies.
- Understand the current coding conventions.
- Identify dependencies between files.
- Check whether existing skills prescribe a different or more appropriate approach.

NEVER unnecessarily recreate existing functionality.

NEVER replace working implementations without a valid reason.

NEVER introduce architectural changes without understanding their impact.

## Who owns what

Each external concern has exactly one owner. The frontend consumes documented contracts and never replaces them.

- **Authentication and sessions:** The configured identity provider or API is authoritative for identity, sessions, and authorization. The frontend implements only the client-side sign-in experience and session handling that the approved integration supports. Expired sessions and authorization errors are handled safely in the client; server-side enforcement is never reimplemented in components or services. Development demo sign-in may use local mock identity data, must be labelled as demo, and never sends or stores credentials.
- **Farmer records, farm details, case history, preferences:** Read and written only through approved API contracts, only for the specialist or agricultural office user authorized to view them. The frontend never creates or manages their server-side persistence.
- **Media and uploads:** The frontend selects files and sends them through the approved upload contract. Upload authorization, validation, storage, access, retention, and deletion are the server’s job. Until an upload contract exists, selected files remain in local component state and are clearly labelled as unsaved.
- **Diagnosis and treatment rendering:** Rendered from the documented response or status contract to show a result, request new evidence, or explain that specialist review is needed. No inference or disease-classification logic lives in the app. Any `/diagnose` prototype uses labelled local-only fixtures; selected images and notes remain in screen memory and are not uploaded or saved.
- **Case assignment, messages, advice, visit status:** Rendered as returned by the approved external service. The frontend never invents assignment or authorization.
- **Notifications:** The external notification or API service owns authoritative notification state. The frontend handles delayed, duplicated, or missed delivery without treating its own cache as truth.
- **Support offices and agricultural offices:** Nearby office information and office-side workflows come from the external service; the frontend only displays it and initiates requests through the documented contract.

## 6. Implementation Standards

All generated and modified code must prioritize:

### Code Quality
- Clean, readable, maintainable code.
- Modular and reusable components.
- Separation of concerns.
- Consistent naming conventions.
- Appropriate error handling.
- Minimal code duplication.

### Documentation
- Provide meaningful comments for important implementation decisions.
- Document functions and subfunctions.
- Explain complex logic.
- Document reusable components and their responsibilities.
- Maintain consistency between documentation and implementation.
- **Follow the beginner-facing explanation rules in Section 0 for all new and modified code.**

### Performance
- Avoid unnecessary rendering.
- Optimize expensive operations.
- Avoid unnecessary dependencies.
- Follow framework-specific performance recommendations.

### Security
- Validate user inputs on the client for user feedback only; server-side validation remains authoritative.
- Handle sensitive information appropriately.
- Avoid exposing secrets.
- Follow secure coding practices.
- Never trust client state for identity. A role, user ID, or ownership claim supplied only by client state is not authorization.

## Definition of done

- Every screen that loads data handles loading, error, and empty states.
- Image and file upload flows validate inputs on the client and handle API failures and retries safely.
- Frontend session handling, authorization-error handling, and record-ownership boundaries are tested against available API contracts or controlled mocks.
- **Every exported function, hook, component, and type added or changed has beginner-facing TSDoc that includes: what it is, what it does, every parameter (and its typical value / default), what it returns, why it exists and where it is used, and an example where helpful. Non-obvious logic has an inline comment explaining what and why.**
- **Every page/screen file added or changed has a top-of-file block comment describing: what the page is, who uses it, what the user sees (section by section), what the user can do, what data it loads or sends, what loading/error/empty states it handles, and how it connects to other pages. Each major section or logical region inside the page has a short descriptive comment above it.**
- **Every file added or changed is listed in the Report with a beginner-friendly description and, for code files, a one-line summary of each function, hook, or component it contains.**
- No hardcoded farmer data, credentials, or privileged endpoints appear in components; all integration passes through `src/services/`.
- No farmer portal, farmer-facing screens, navigation, or workflows are added. The app contains exactly two portals: specialist and agricultural office.

## 7. Development Workflow

Follow this workflow for every development task:

### Phase 1: Understand
- Understand the requested functionality.
- Inspect the relevant existing files.
- Identify project constraints.

### Phase 2: Discover Skills
- Inspect installed skills.
- Read applicable `SKILL.md` files.
- Extract relevant implementation requirements.

### Phase 3: Plan
- Identify affected files.
- Determine reusable components.
- Establish the implementation approach.
- Identify potential risks.
- If requirements are ambiguous, stop and ask for clarification before making architectural assumptions.

### Phase 4: Implement
- Follow the applicable skills.
- Respect the existing architecture.
- Write clean, modular code.
- **Write beginner-facing TSDoc, inline comments, and page-level explanations as described in Section 0.**
- Document important implementation details.
- Keep all API work behind `src/services/`; never call external endpoints directly from a component.

### Phase 5: Verify
- Run `npm run build` and `npx tsc --noEmit`.
- Identify and resolve errors.
- Verify that existing functionality remains intact.
- Confirm that implementation follows applicable skill instructions.
- **Confirm that every function, hook, component, and page added or changed carries the beginner-facing comments required by Section 0 and the Definition of done.**

### Phase 6: Report
Provide the report described under **Reporting**.

## Reporting

End every piece of work that changes code with this report:

- **Done:** one line on the outcome, then the files changed and what changed in each. For every changed file, include a beginner-friendly description of what the file does and, for code files, a one-line summary of each function, hook, or component it contains.
- **Verified:** each check with ✅ or ❌ and its evidence. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take (keys, assets, backend contracts).
- **Test it yourself:** numbered steps from a fresh start, ending with `Expected:`.
- **Notes:** defaults picked, trade-offs, and anything left for later.

## 8. Skill Installation and Updates

Skills may be installed or updated during project development.

When new skills become available:

1. Discover the newly installed skills.
2. Read their `SKILL.md` instructions.
3. Identify their intended use cases.
4. Incorporate them into future relevant development tasks.

Do not assume that previously consulted skills cover newly introduced functionality.

Do not modify installed skill files unless explicitly requested.

## Checks

- Screens that load data handle loading, error, and empty states.
- Upload flows validate on the client and handle API failure and retry.
- Session expiry and authorization errors are handled without leaking farmer-owned data.
- No direct database, object-store, or privileged AI access exists anywhere in the app.
- No new dependency is introduced without justification in the report.
- No prompt document is created outside `prompts/`.
- No farmer portal or farmer-facing route, screen, or workflow is introduced.
- **Every new or changed function, hook, component, and page has beginner-facing comments as defined in Section 0.**
- **The Report lists every changed file with a beginner-friendly description of what it does.**

## 9. Important Agent Restrictions

The AI agent MUST NOT:

- Ignore relevant installed skills.
- Skip reading applicable skill instructions.
- Claim to have followed skills it has not consulted.
- Install unnecessary packages without justification.
- Introduce unrelated functionality.
- Make assumptions about unspecified requirements.
- Rewrite unrelated project files.
- Violate existing project conventions without justification.
- Sacrifice maintainability for implementation speed.
- Invent an API endpoint or build a backend when a contract is missing. Isolate the integration behind a typed service interface and use labelled mocks for UI-only work.
- Connect the app directly to a database, private object store, or privileged AI service.
- Add a farmer portal, farmer-facing screens, navigation, or workflows. The app has exactly two portals: specialist and agricultural office.
- **Leave a new or modified function, hook, component, or page without the beginner-facing comments required by Section 0.**
- **Describe a file's purpose in the Report using jargon a beginner would not understand.**

If requirements are ambiguous, ask for clarification before making architectural assumptions.

## 10. Final Development Rule

**Every implementation must be skills-informed, architecture-aware, maintainable, beginner-explainable, and verified.**

Installed skills provide specialized implementation knowledge. This AGENTS.md establishes the rules governing how those skills must be discovered, interpreted, and applied.

The objective is not merely to generate working code, but to produce reliable, scalable, secure, professionally maintainable software that a beginner can read and understand.