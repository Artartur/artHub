# ArtHub

A client-side application that lets you search GitHub users and explore their repositories.

## Requirements

- Node.js 18+
- npm or yarn

## Installation

```bash
git clone https://github.com/artartur/arthub.git
cd arthub
npm install
```

## Configuration

Copy the example environment file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API requests. Use `/api` when running with Vercel CLI, or `https://api.github.com` for local development without the proxy. |

## Running locally

### Without Vercel serverless functions

```bash
npm run dev
```

Set `VITE_API_URL=https://api.github.com` in `.env`. Requests go directly to the GitHub API — no token, subject to rate limiting (60 req/h).

### With Vercel serverless functions (recommended)

Install the Vercel CLI and run:

```bash
npm install -g vercel
vercel dev
```

Set `VITE_API_URL=/api` in `.env`. Configure the following environment variables in your Vercel project (Settings → Environment Variables):

| Variable | Description |
|---|---|
| `GITHUB_API_URL` | `https://api.github.com` |
| `GITHUB_TOKEN` | GitHub personal access token |

This keeps your token server-side only — it is never exposed to the browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |

## Tech stack

- React 19 + TypeScript
- Vite 8
- React Router DOM v7
- Axios
- Bootstrap 5 + Bootstrap Icons
- Vitest + Testing Library

## Beyond the challenge requirements

The following features were implemented beyond what was specified:

- **Infinite scroll**: repositories load progressively as the user scrolls, with `IntersectionObserver` and request cancellation via `AbortController`
- **Direct URL access**: `/user/:username` can be shared or bookmarked; the app fetches user data from the URL parameter when no router state is available
- **Skeleton loading**: placeholder UI while user data and repositories are loading
- **Vercel serverless proxy**: `api/users/:username` and `api/repos/search` proxy requests to GitHub, keeping the token server-side
- **Unit tests**: screens covered with Vitest and Testing Library

## Assets

Home:
<img width="1920" height="964" alt="image" src="https://github.com/user-attachments/assets/bcb1e545-2f12-4a68-ab57-6eb095b415b4" />

User:
<img width="1920" height="964" alt="image" src="https://github.com/user-attachments/assets/f1393d5a-70f9-40be-aed1-e34d8fa09e9f" />

Repo:
<img width="1920" height="964" alt="image" src="https://github.com/user-attachments/assets/c397a1c5-5a97-42c6-8799-bc20b32a3568" />

NotFound:
<img width="1920" height="964" alt="image" src="https://github.com/user-attachments/assets/265f637a-0f74-40b6-a20f-4344dbeecf1c" />


