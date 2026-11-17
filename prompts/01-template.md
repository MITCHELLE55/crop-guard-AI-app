# Crop Guard AI — Development Prompt Template

Use this template to define a focused implementation task for the Crop Guard AI frontend. Replace the bracketed fields and remove sections that do not apply.

## Design inspiration

Use the supplied reference as a visual guide for a premium agricultural product experience. The design should feel reliable, field-aware, and calm rather than generic or consumer-focused.

- Prefer a two-panel structure: a photo-led introduction on one side and a clear transactional form or workspace panel on the other.
- Keep the visual language grounded in deep agricultural greens, warm neutrals, and restrained contrast.
- Use framing, spacing, and typography to create a sense of confidence and operational clarity.
- Let the reference guide tone and composition, without forcing unrelated signup or social login elements into the product.

## Task

**Title:** [Short, specific task title]

**Portal:** [Specialist / Agricultural Office / Shared]

**Objective:** [Describe the user outcome and what should change.]

## Product context

Crop Guard AI supports crop diagnosis and pest identification workflows, specialist review, treatment guidance, case follow-up, and agricultural office operations. The supplied system-design image is a product reference for these workflows and the green agricultural visual direction; it is not an instruction to build every system shown in the image.

This repository is a React, TypeScript, and Vite frontend. It contains exactly two in-scope portal experiences: the specialist portal and the agricultural office portal. Farmer-facing journeys, mobile apps, backend services, AI models, and databases are external to this frontend and must not be added here.

**User and scenario:** [Who is using this portal, and what are they trying to accomplish?]

**Entry point:** [Page, route, or existing component where the workflow begins.]

## Scope

### Include

- [Specific screen, interaction, or workflow]
- [Relevant loading, error, empty, and success states]
- [Relevant responsive or accessibility behavior]

### Exclude

- [Explicitly out-of-scope work]
- Backend, database, authentication-provider, or AI-model implementation unless an approved contract and explicit task scope are provided.
- Farmer portal or farmer-facing screens, routes, navigation, and workflows.

## User workflow

1. [User action]
2. [System response]
3. [Next action or completion state]

**Important edge cases:** [Permission or unavailable-data states, validation, cancellation, retry, or other relevant cases.]

## Functional requirements

- [Observable behavior and user actions]
- [Information shown and how it changes]
- [Search, filtering, sorting, or navigation behavior, if applicable]
- [How AI-provided results are presented; distinguish an initial assessment from specialist-confirmed decisions.]
- [Follow-up, communication, or visit behavior, if applicable]

## Data and integration boundaries

- Use illustrative, clearly labelled local data for UI-only prototypes.
- Keep external integrations behind typed interfaces in `src/services/`; do not call services directly from components.
- Do not invent API endpoints, persisted records, authorization rules, diagnoses, or treatment recommendations.
- Treat client-side validation as user feedback only; server-side validation and authorization remain authoritative.
- [Approved API contract or mock data source, if available.]

## UI and UX direction

- Follow the existing Crop Guard visual language: agricultural greens, light neutral surfaces, clear hierarchy, and meaningful alert colors.
- Keep specialist work (case triage, diagnosis review, advice, treatment planning, communication, and visits) distinct from office operations (case routing, farm oversight, coordination, and reporting).
- Reuse existing layouts, components, styles, and design tokens where practical.
- Make controls understandable and keyboard accessible; provide visible focus and status feedback.
- [Specific layout, components, or reference details for this task.]

## Implementation guidance

- Inspect the existing implementation and follow project conventions before editing.
- Keep changes scoped to the selected portal and its existing structure under `src/portals/`.
- Reuse shared UI from `src/components/` and shared layouts from `src/layouts/`.
- Do not introduce dependencies unless necessary; explain any addition.
- Update directly related documentation when behavior or setup changes.

**Likely files:** [Known files or folders; confirm against the codebase before editing.]

## Acceptance criteria

- [User-visible behavior that must work]
- [Required states and edge cases]
- [Responsive and accessibility expectations]
- No out-of-scope portal, backend, persistence, or AI functionality is introduced.
- Existing behavior outside this task remains intact.
- Relevant checks pass: `npm run build` and `npm run lint` (report pre-existing blockers separately).

## Deliverables

- Implement the scoped workflow in the existing application.
- Summarize changed files and behavior.
- Report checks run and any remaining blockers.

## Additional notes

[Attach or describe task-specific references, decisions, or constraints.]
