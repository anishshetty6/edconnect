# Project Name

A full-stack application with React frontend and Node.js backend.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Set up Backend:**

   ```bash
   cd backend
   npm install
   nodemon index.js
   ```

   Backend will start on http://localhost:5000

2. **Set up Frontend:**
   ```bash
   cd front-end
   npm install
   npm run dev
   ```
   Frontend will start on http://localhost:5173

### Project Structure

```
├── backend/         # Node.js backend
├── front-end/       # React frontend
└── README.md
```

### Environment Variables

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:5173

## Scripts

- Backend: `nodemon index.js` - Starts the backend server with auto-reload
- Frontend: `npm run dev` - Starts the Vite development server
