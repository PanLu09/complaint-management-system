# Complaint Management System

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: Supabase (PostgreSQL)

## Setup Instructions

### Backend
1. `cd server`
2. `npm install`
3. Create a `.env` with your `DATABASE_URL` and `SUPABASE_SERVICE_KEY`
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

## Assumptions
- Admin page is not authenticated (for demo purposes)
- Users can navigate to `/submit` and `/admin` directly via the browser's address bar.
The root page (/) currently has no UI, so users cannot navigate between pages easily.
- The list of complaints is assumed to be small.
- Minimal error handling due to time constraints

## Improvements (with more time)
- Add authentication for admin dashboard
- Add a root landing page with clear navigation links to both subpages.
- Implement pagination to handle a larger dataset effectively in the admin view.
- Write unit tests, component tests, integration and end-to-end tests using tools like Jest and Cypress
