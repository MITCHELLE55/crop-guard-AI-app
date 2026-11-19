<<<<<<< HEAD
# Crop Guard AI

Crop Guard AI is a React, TypeScript, and Vite frontend for an agricultural support application with two separate portals. Specialists enter at `/specialist/login`, and agricultural office coordinators enter at `/office/login`. Both sign in pages open local demo workspaces only; there is no real authentication service or live farmer data.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Frontend structure

```text
src/
├── assets/                 # Imported images and other static assets
├── components/             # Shared UI primitives
├── layouts/                # Portal layouts and navigation
├── portals/
│   ├── agricultural-office/
│   │   ├── components/
│   │   └── pages/
│   └── specialist/
│       ├── components/
│       ├── pages/
│       └── types.ts
├── services/               # Backend and external-service integrations
├── App.tsx                 # Separate portal URLs and app-level navigation
├── main.tsx                # React application entry point
├── App.css                 # Portal and component styling
└── index.css               # Global styles and design tokens
```

## Portal demo baseline

- The specialist portal has fixed, collapsible navigation with responsive mobile behavior.
- Command-centre workload cards, searchable priority case queue, regional alerts, and an upcoming visit summary.
- A seven-section consultation workspace for farm profile, AI diagnosis, expert advice, treatments, farm visits, communication, and case records.
- The agricultural office portal has its own sign in page, office overview, farmer registry, visit planning, resource schedule, and reports.
- Each portal has a separate sign in URL and its own local demo workspace. Switching portals opens the other portal's sign in page.
- AI output is presented as an initial assessment; specialist confirmation or override is tracked separately in the interface.
- Deep agricultural green, white, and light-green surfaces with red and amber alert states.

The farmer names, case metrics, alerts, and activity shown in the UI are illustrative prototype data. The `services/` folder is reserved for API integration; no live farmer or agricultural records are currently connected.
=======
# crop-guard-AI-app
>>>>>>> 885d003e401b29a0c1ab287bcce04ca1636be267
