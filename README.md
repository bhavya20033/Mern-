# Mini Event Platform (MERN Stack)

A complete MERN Stack project for managing events and RSVPs.

## Tech Stack
- **MongoDB**: Database
- **Express.js**: Backend Framework
- **React.js**: Frontend Framework
- **Node.js**: Runtime Environment

## Features
1. **User Authentication**: Signup, Login, JWT-based auth.
2. **Event Management**: Create, Read, Update, Delete events (with image upload).
3. **RSVP System**: Join/Leave events with strict capacity enforcement.
4. **Concurrency Handling**: Atomic database operations to prevent overbooking.
5. **Responsive UI**: Built with React and CSS.

## Folder Structure
```
miniproject/
├── client/         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
├── server/         # Express Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or use Atlas URI)

### 1. Backend Setup
```bash
cd server
npm install
# Create .env file if not exists (see below)
npm run dev
```

**Server .env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/minieventplatform
JWT_SECRET=your_secret_key
```

### 2. Frontend Setup
```bash
cd client
npm install
# Create .env file if not exists (see below)
npm start
```

**Client .env:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## RSVP Concurrency Handling
To ensure no overbooking occurs when multiple users RSVP simultaneously, we use **MongoDB Atomic Operations**.

Instead of:
1. Reading the event `capacity` and `currentAttendees`.
2. Checking if `currentAttendees < capacity`.
3. Saving the new count.
(Which causes race conditions)

We do this in **one atomic step**:
```javascript
const event = await Event.findOneAndUpdate(
  {
    _id: eventId,
    attendees: { $ne: userId }, // Ensure user hasn't already RSVPed
    $expr: { $lt: ['$currentAttendees', '$capacity'] } // Atomic check: current < capacity
  },
  {
    $push: { attendees: userId },
    $inc: { currentAttendees: 1 } // Atomic increment
  },
  { new: true }
);
```
If the condition fails (capacity full or user already RSVPed), MongoDB returns `null`, and we handle the error gracefully.

## Deployment
- **Backend**: Deploy to Render or Railway.
- **Frontend**: Deploy to Vercel or Netlify.
- **Database**: MongoDB Atlas.
