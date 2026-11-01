# Personal blog (Next.js)

Frontend Mentor personal blog with MongoDB-backed posts and a password-protected admin area.

## Stack

- Next.js (App Router), pnpm, Shadcn UI, Zustand
- Public markdown rendering: `react-markdown` + `remark-gfm`
- Admin editor: MDXEditor
- Mutations: Server Actions
- Database: MongoDB + Mongoose

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Without `MONGODB_URI`, public pages read from `src/data/posts.json`. Admin create/edit/delete requires MongoDB.

## Environment

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_PASSWORD` | Plain password (dev) |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash (preferred in production) |
| `SESSION_SECRET` | 32+ char secret for iron-session |

Generate a bcrypt hash after seeding:

```bash
ADMIN_PASSWORD=your-password pnpm seed -- --hash-password
```

Copy the printed hash into `ADMIN_PASSWORD_HASH` and remove plain `ADMIN_PASSWORD` in production.

## Seed sample posts

```bash
MONGODB_URI=... pnpm seed
```

Upserts all posts from `src/data/posts.json` by `slug`.

## Scripts

- `pnpm dev` — development server
- `pnpm build` / `pnpm start` — production
- `pnpm seed` — load JSON into MongoDB
- `pnpm test:e2e` — Playwright end-to-end tests (builds app, runs `pnpm start`)
- `pnpm test:e2e:ui` — Playwright UI mode

E2E loads env from `.env` / `.env.local`, seeds MongoDB when `MONGODB_URI` is set, and uses plain `ADMIN_PASSWORD` for admin login tests.

First-time Playwright browser install:

```bash
pnpm exec playwright install chromium
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home + latest articles |
| `/blog` | All posts |
| `/blog/[slug]` | Article |
| `/about`, `/newsletter` | Static pages |
| `/admin/login` | Password login |
| `/admin` | Post list |
| `/admin/posts/new` | Create (MDXEditor) |
| `/admin/posts/[id]/edit` | Edit |
