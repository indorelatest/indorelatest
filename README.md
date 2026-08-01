# News Website

A bilingual news website prototype serving Indore and Madhya Pradesh, built with a complete React frontend and a Node.js/Express backend.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cors, Dotenv

## Features

- **Bilingual Support**: Toggle between Hindi and English dynamically across all pages.
- **Dark Mode**: Smooth light and dark mode toggles with choice persistence.
- **Interactive Pages**: Category-filtered views, single-article detail readers, and related news recommendations.
- **Admin Control Panel**: Control center to manage articles (create, edit, delete), view statistics, check contact form messages, and manage newsletter subscribers.
- **Contact Forms**: Working feedback and contact submission form.

## First-Time Setup

To get the project up and running quickly on a fresh environment:

1. **Set Up MongoDB**: Create a database cluster in MongoDB Atlas (or use a local MongoDB instance).
2. **Configure Environment**:
   - Copy the template environment configuration to create your local env file:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Open `backend/.env` and paste your MongoDB connection string into `MONGO_URI`.
3. **Install Dependencies**:
   - Install frontend dependencies in the root folder:
     ```bash
     npm install
     ```
   - Install backend dependencies in the `backend` folder:
     ```bash
     cd backend && npm install && cd ..
     ```
4. **Start the Project**:
   - Start the frontend dev server (from the root folder):
     ```bash
     npm run dev
     ```
   - Start the backend server (from the `backend` folder):
     ```bash
     cd backend && npm start
     ```
     _(Note: The server will automatically detect if your database is empty on connection success, and it will self-seed/import the default news articles from `src/data/news.json` without needing manual seed commands!)_

## Installation & Setup

### Prerequisites

Make sure you have Node.js and MongoDB installed and running.

### Steps

1. Clone the repository and navigate to the project directory.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend developer server:
   ```bash
   npm run dev
   ```
4. Navigate to the backend directory:
   ```bash
   cd backend
   ```
5. Install backend dependencies:
   ```bash
   npm install
   ```
6. Set up your environment variables in a `.env` file inside the `backend` folder (refer to configuration parameters like `MONGO_URI`, `PORT`, `ADMIN_PASSCODE`).
   - If your frontend and backend are deployed separately, add `VITE_API_BASE` to your frontend build environment pointing to the backend origin, for example:
     ```bash
     VITE_API_BASE=https://api.indorelatest.com
     ```
7. Start the backend server:
   ```bash
   npm run dev
   ```

## Project Structure

### Frontend (`/src`)

- `components/`: Layout components (Header, Navbar, Footer), common features, and news widgets.
- `context/`: LanguageContext for bilingual states and translations.
- `hooks/`: Custom React hooks for fetching and filtering news articles.
- `pages/`: Core views (Home, News detail, Category, Contact, About, Privacy, Disclaimer, Admin).
- `routes/`: Routing config using React Router.
- `services/`: Fetch services calling backend REST endpoints.

### Backend (`/backend`)

- `config/`: Database connection management.
- `controllers/`: Request handlers for articles, subscribers, and contacts.
- `models/`: Mongoose schemas for MongoDB collections.
- `routes/`: REST API endpoints routing definition.
- `middleware/`: Global error handlers and route middlewares.
- `server.js`: Server startup entry point.
