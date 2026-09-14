# Ella's Been Busted — Version 1

This first build creates the redesigned homepage without touching the existing live website.

## What is included
- React/Vite front end
- Node/Express server
- Mature cream / blush / charcoal visual theme
- Responsive mobile layout
- Homepage
- Recent Busts gallery preview
- Submit-a-photo teaser
- Admin Login placeholder
- API health endpoint

## Next build steps
1. Replace placeholders with real Ella photos.
2. Add full Gallery page/lightbox.
3. Add visitor photo upload form.
4. Add persistent image storage.
5. Add database for captions, dates, submitters, status, and albums.
6. Add Admin login and Pending Approval queue.
7. Deploy separately for testing.
8. Point ellasbeenbusted.com to the new site only after approval.

## Run locally / in Codespaces
From the project root:

npm install
npm run install:all
npm run dev

Vite usually opens the front end on port 5173.
The API server runs on port 3001.
