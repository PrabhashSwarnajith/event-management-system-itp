# Event Management System

Full-stack starter project for a university Event Management System with a React + Vite + Tailwind CSS frontend and a Spring Boot backend.

## Project structure

```text
event-management-system-itp/
|- frontend/   # React + Vite + Tailwind CSS
|- backend/    # Spring Boot REST API
|- .gitignore
|- README.md
```

## Frontend

- React with Vite
- Tailwind CSS setup
- Login, signup, profile, and logout flow
- Event listing, search, and organizer event management

## Backend

- Spring Boot REST API
- `/api/health` endpoint
- Auth endpoints for signup and login
- Event CRUD endpoints
- H2 database for local development
- CORS enabled for the local frontend

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend default URL: `http://localhost:8080`

## Build commands

```bash
cd frontend
npm run build
```

```bash
cd backend
mvn test
```

## Ready for Git

The repository includes a root `.gitignore` for both frontend and backend generated files, so it is ready to commit and push after installing dependencies.
