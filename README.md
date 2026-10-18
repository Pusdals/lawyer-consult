# Consultation

A local-only portfolio demo: a small lawyer consultation booking app that runs in the browser. There is no backend. Consultations, chat, and profile data stay in `localStorage` on this device.

## Stack

- Vite
- React
- TypeScript

Lint is Oxlint (`npm run lint`). Format is Prettier (`npm run format`).

## Run on a Mac

Install [Node.js](https://nodejs.org/) (Apple Silicon builds are fine), then from this folder:

```bash
npm install
npm run dev
```

Vite prints a local URL, usually http://127.0.0.1:5173/. Open it in a browser.

`npm run build` typechecks and writes a static build to `dist`. `npm run preview` serves that build.

## What works

The window is a dark-purple, phone-width column with four bottom tabs.

1. **Upcoming** shows consultations with date, time, place, and status. The first visit seeds one scheduled office visit and one completed online visit. An empty list shows an empty state.
2. **Book** asks for a date, a time, and a place: office, online, or custom text. Missing fields stay on the form. A valid save adds a scheduled consultation and opens Upcoming.
3. **Online** is one chat thread. The seed is a short counsel greeting and a client reply. Messages you send are stored locally. There is no messaging service.
4. **Profile** stores name, email, and an avatar preview (images under 700 KB) as you edit them. Change password checks that every field is filled, the new password is at least 8 characters, and the confirmation matches. The password is not stored or sent.

Data lives under the `localStorage` key `lawyer-consult.v1`. Clearing site data for this origin removes it. The next load writes the seed again.

## CRM

`src/storage.ts` contains one stub comment and nothing behind it:

```ts
// CRM: not connected in this demo
```

There is no auth server, payments, or notifications.
