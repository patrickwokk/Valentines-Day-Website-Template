# Valentine's Day Template

## Overview

A generic, customizable Valentine's Day web experience template built as a single-page application. The app presents a playful "Will you be my Valentine?" question with animated puppy GIFs, a photo gallery with 3D parallax scrolling, and an animated love letter envelope with placeholder text. It also includes a "Replay Story" page (`/replay`) that presents a scrollable memory gallery with Spotify integration. All text is in English and uses generic stock photos as placeholders — users should replace them with their own photos and personalize the letter content. The backend is minimal — an Express server that serves the static React build with no significant API endpoints currently in use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite (dev server on port 5000, proxied through Express)
- **Routing**: Wouter (lightweight client-side router)
- **Styling**: Tailwind CSS v4 (using `@import "tailwindcss"` syntax with the `@tailwindcss/vite` plugin)
- **UI Components**: shadcn/ui component library (New York style, stored in `client/src/components/ui/`)
- **Animations**: Framer Motion for scroll-driven parallax, transitions, and interactive animations
- **Fonts**: Fredoka (playful), Cormorant Garamond (romantic), Inter (general) via Google Fonts
- **State Management**: React Query (`@tanstack/react-query`) is set up but minimally used since the app is mostly static/client-side
- **Custom Theme**: Valentine's pink/red color palette with custom CSS variables and animations (float, heartbeat, pulse-slow)

### Pages
- `/` — Main Valentine page (`client/src/pages/valentine.tsx`): Question prompt with game states (INITIAL → REJECT_1 → REJECT_2 → SUCCESS), photo gallery with 13 photos in parallax layers, and love letter
- `/replay` — Replay Story page (`client/src/pages/replay-story.tsx`): Scrollable memory gallery with 36 photos organized in frames, includes Spotify embed integration
- `*` — 404 Not Found page

### Backend
- **Framework**: Express 5 on Node.js
- **Purpose**: Primarily serves the static frontend build; minimal API surface
- **Dev Mode**: Vite dev server middleware is integrated via `server/vite.ts` for HMR
- **Production**: Built with esbuild (server) and Vite (client), output to `dist/`
- **Storage**: In-memory storage (`MemStorage` class) with a basic User CRUD interface — currently unused by the app's core features

### Database Schema (Configured but not actively used)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Single `users` table with `id` (UUID), `username`, and `password` fields defined in `shared/schema.ts`
- **Validation**: Zod schemas generated via `drizzle-zod`
- **Note**: The database is configured via `DATABASE_URL` environment variable but the app currently uses in-memory storage. A PostgreSQL database can be provisioned and connected when needed.

### Build System
- **Client Build**: Vite builds to `dist/public/`
- **Server Build**: esbuild bundles `server/index.ts` to `dist/index.cjs`, with common dependencies bundled and others externalized
- **Build Script**: `script/build.ts` orchestrates both builds
- **Dev**: `npm run dev` runs the Express server with Vite middleware for HMR

### Asset Management
- Static assets (photos, GIFs) are stored in `attached_assets/` directory and imported directly into components
- Replay story memories are in `attached_assets/replay_memories/`
- Vite alias `@assets` maps to `attached_assets/` for clean imports
- Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`

### Key Design Decisions
1. **Wouter over React Router**: Chosen for its tiny bundle size since the app only has 2-3 routes
2. **In-memory storage over database**: The app is primarily a static experience with no user-generated data to persist (though Drizzle + PostgreSQL is scaffolded for future use)
3. **Framer Motion for animations**: Provides scroll-linked transforms and spring physics needed for the parallax gallery and envelope animation
4. **Static asset imports**: Photos are imported as modules rather than fetched from an API, keeping the app self-contained and fast

## External Dependencies

### Third-Party Services
- **Google Fonts**: Fredoka, Cormorant Garamond, and Inter fonts loaded via CDN
- **Spotify**: Embedded player integration in the replay story page (uses Spotify's embed API/controller)
- **PostgreSQL**: Database configured via `DATABASE_URL` environment variable (not actively used, but Drizzle config expects it for `db:push`)

### Key NPM Packages
- `framer-motion` — Animation library for scroll-driven effects and transitions
- `wouter` — Lightweight client-side routing
- `drizzle-orm` + `drizzle-zod` — ORM and schema validation (scaffolded, minimal use)
- `@tanstack/react-query` — Data fetching/caching (scaffolded, minimal use)
- `@radix-ui/*` — Headless UI primitives for shadcn/ui components
- `tailwindcss` + `tailwindcss-animate` + `tw-animate-css` — Styling and animation utilities
- `express` v5 — HTTP server
- `vaul` — Drawer component
- `embla-carousel-react` — Carousel component
- `recharts` — Chart component library (available but not actively used)

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in development
- `@replit/vite-plugin-cartographer` + `@replit/vite-plugin-dev-banner` — Dev-only Replit integrations
- Custom `vite-plugin-meta-images` — Updates OpenGraph meta tags with the correct Replit deployment domain