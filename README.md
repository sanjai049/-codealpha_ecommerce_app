# Aura Electronics - E-Commerce App

A functional, full-stack e-commerce web application featuring a modern, premium UI.

## Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript (no external frameworks).
- **Backend**: Node.js, Express.js.
- **Database**: SQLite3.
- **Auth**: JWT, bcrypt.

## Features
- Dynamic product catalog fetched from the SQLite database.
- Premium UI with glassmorphism, modern typography (Outfit), and micro-animations.
- User registration and login with JWT authentication.
- Shopping cart functionality with local storage persistence.
- Mock checkout process.

## Setup Instructions

1. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Seed the Database**
   Initialize the database and populate it with 10 realistic dummy products:
   ```bash
   node db/seed.js
   ```

3. **Start the Server**
   Start the backend Express server (which also statically serves the frontend):
   ```bash
   node server.js
   ```

4. **View the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Folder Structure
- `/db`: SQLite database file, initialization script, and seed script.
- `/public`: Frontend assets (HTML, CSS, JS).
- `/routes`: Express backend API routes (Auth, Products, Orders).
- `server.js`: Main entry point for the backend application.
