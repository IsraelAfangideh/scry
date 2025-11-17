# Scry

Scry is a lean Nuxt dashboard for browsing all active Reg CF and Reg A+ raises on KingsCrowd. Data is fetched through a
Nitro server route to keep the API key off the client, and the UI intentionally stays simple: Tailwind styling, a clean
table, proper loading/empty/error states, and CSV export for the current page of results. Pagination is handled
server-side so the browser only deals with what it needs.

## Why It’s Built This Way

Kept the implementation lightweight instead of pulling in heavy table libraries. The goal was clarity, maintainability,
and a small surface area for the reviewer. With more time, I’d add sortable columns, richer filters, and deeper a11y
improvements.

## Running Locally

1. Clone the repo
2. `cd scry`
3. Add `KINGS_API_KEY` to your environment
4. `npm install`
5. `npm run dev`
6. Open `http://localhost:3000`

## What’s Inside

- **Nuxt 4** with server routes for secure API access
- **Tailwind** for styling
- **Server-side pagination**
- **CSV export** for visible rows
- **Loading / Empty / Error** UI states
- **Basic accessibility checks** (labels, keyboard focus, a11y tooling)

## Testing

- Playwright
- a11y checks

## AI Use

ChatGPT (GPT-5.1) helped generate initial TypeScript types from the API response, clarify parts of the docs, and act as
a rubber duck. All logic and structure were implemented and reviewed manually.
