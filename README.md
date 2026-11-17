# Crop Guard AI

Crop Guard AI is a React, TypeScript, and Vite frontend starter for a multi-portal agricultural support application. The current runnable experience is the agricultural specialist portal, designed around the command centre and a unified farmer consultation workspace.

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
│   ├── admin/
│   │   ├── components/
│   │   └── pages/
│   ├── agricultural-office/
│   │   ├── components/
│   │   └── pages/
│   ├── farmer/
│   │   ├── components/
│   │   └── pages/
│   └── specialist/
│       ├── components/
│       ├── pages/
│       └── types.ts
├── services/               # Backend and external-service integrations
├── App.tsx                 # Portal selection and app-level navigation
├── main.tsx                # React application entry point
├── App.css                 # Portal and component styling
└── index.css               # Global styles and design tokens
```

## Specialist portal baseline

- Fixed, collapsible specialist navigation with responsive mobile behavior.
- Command-centre workload cards, searchable priority case queue, regional alerts, and an upcoming visit summary.
- A seven-section consultation workspace for farm profile, AI diagnosis, expert advice, treatments, farm visits, communication, and case records.
- AI output is presented as an initial assessment; specialist confirmation or override is tracked separately in the interface.
- Deep agricultural green, white, and light-green surfaces with red and amber alert states.

The farmer names, case metrics, alerts, and activity shown in the UI are illustrative prototype data. The `services/` folder is reserved for API integration; no live farmer or agricultural records are currently connected. The other portal folders establish the intended structure and can be implemented independently.
