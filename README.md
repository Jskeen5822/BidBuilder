# BidBuilder

BidBuilder is an Expo-powered React Native app that lets construction companies or homeowners publish projects, collect bids, and lock in the lowest price. Because it is built with React Native, the exact same codebase runs on iOS, Android, and the web.

## Highlights

- Create project briefs with owner, budget, delivery date, and scope highlights.
- Track live bids directly on every project card and see the lowest offer at a glance.
- Accept the cheapest bid with a single tap - BidBuilder flags it as the winner automatically.
- Sort projects by recency, budget size, or number of bids to focus on what matters most.

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. In one terminal, start the backend API (Express, in-memory store today, database-ready later):

   ```bash
   npm run backend
   ```

3. In another terminal, start the Expo development server (choose the platform you want):

   ```bash
   # Expo Dev Tools with QR for native + option for web
   npm start

   # Run the optimized React Native Web build in your browser
   npm run web
   ```

4. (Optional) Set `EXPO_PUBLIC_API_URL` if your backend runs anywhere other than `http://localhost:4000`.

5. In the running app:
   - Use **Create a Project** to publish scopes.
   - Scroll to **Open Projects** to see every live opportunity.
   - Contractors can add company, price, and timeline.
   - Tap **Accept lowest bid** on any project to instantly select the cheapest offer.

## Tech stack

- [Expo](https://expo.dev) for unified native + web tooling.
- React Native components and styles for a consistent UI layer.
- Express API with CORS for future database-backed auth/project/bid flows.
- Local state via React hooks for projects, bids, sorting, and winner selection.

## Backend API

The new Express server (see `backend/`) exposes the following routes, all currently persisted in memory so you can swap in a real database later:

- `POST /auth/register` — create a mock user account (password hashing can be added when the DB layer arrives).
- `POST /auth/login` — returns a placeholder token and user payload.
- `GET /projects` — list every project with nested bids and winner metadata.
- `POST /projects` — add a new project (IDs are supplied by the client today).
- `POST /projects/:projectId/bids` — append a bid to a project.
- `POST /projects/:projectId/select` — mark an existing bid as the winner.

## Project structure

- `frontend/` - presentation layer (screens, UI components, styles, app context, and API client).
- `backend/` - Express API for auth, project listings, and bid storage (currently in-memory for easy DB swap later).
- `firmware/` - placeholder for future native/embedded integrations (unused today).
