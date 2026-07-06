<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SmartVisitingCard

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- React Hook Form + Zod
- Lucide React
- Sonner (toasts)
- Framer Motion
- next-themes (dark mode)
- qrcode
- react-dropzone

## Architecture
- **File-based storage**: JSON files in `/data/cards/`
- **Uploads**: Stored in `/public/uploads/{profile,logos,gallery,brochure}/`
- **Authentication**: Cookie-based session (no JWT, no DB)
- **Data layer**: Services in `/src/services/` — swap to Prisma/Supabase later by replacing these files

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm start` — Start production server

## Key Credentials
- Admin login: `admin` / `admin123` (config in `src/config/auth.ts`)

## Project Structure
```
src/
  app/            — Next.js App Router pages & API routes
  components/     — UI, dashboard, cards, public-card components
  config/         — App configuration
  lib/            — Utilities & validations
  services/       — Data layer (cards, auth, storage)
  types/          — TypeScript types
data/
  cards/          — JSON card files (slug.json)
public/
  uploads/        — Uploaded files (profile, logos, gallery, brochure)
  icons/          — App icons
```

## Key API Routes
- POST `/api/auth/login` — Login
- GET `/api/auth/logout` — Logout
- GET `/api/cards` — List cards (?search=&theme=)
- POST `/api/cards/create` — Create card
- PUT `/api/cards/[slug]` — Update card
- DELETE `/api/cards/delete` — Delete card
- POST `/api/cards/duplicate` — Duplicate card
- POST `/api/upload` — Upload file
- GET `/api/uploads` — List uploads
