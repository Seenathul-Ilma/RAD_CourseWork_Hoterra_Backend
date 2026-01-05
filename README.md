# 🔧 Hoterra Backend

A robust Node.js/Express API server for the Hoterra hotel management system. Handles user authentication, room management, bookings, and real-time availability checking.

## 🌐 Live API
**Backend**: https://rad-course-work-hoterra-backend.vercel.app

## 🛠️ Tech Stack
- **Node.js + Express** - Server framework
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **CORS** - Cross-origin requests

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)
- Git

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Seenathul-Ilma/RAD_CourseWork_Hoterra_Backend.git
cd hoterra-backend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hoterra
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

### Run Development Server

```bash
npm run dev
```

Server will run at `http://localhost:5000`

## 📂 Project Structure

```
src/
├── config/               # Configuration files
│   ├── cloudinary.ts     # Image upload config
│   └── transporter.ts    # Email service config
├── controllers/          # Route handlers (business logic)
│   ├── ai.controller.ts
│   ├── amenity.controller.ts
│   ├── auth.controller.ts
│   ├── availability.controller.ts
│   ├── booking.controller.ts
│   ├── invite.controller.ts
│   ├── room.controller.ts
│   ├── roomtype.controller.ts
│   └── user.controller.ts
├── middlewares/          # Custom middleware
│   ├── auth.ts          # JWT verification
│   ├── roles.ts         # Role-based authorization
│   └── upload.ts        # File upload handling
├── models/              # MongoDB schemas
│   ├── Amenity.ts
│   ├── Booking.ts
│   ├── Invitation.ts
│   ├── Room.ts
│   ├── RoomAmenity.ts
│   ├── RoomType.ts
│   └── User.ts
├── routes/              # API endpoints
│   ├── amenity.routes.ts
│   ├── auth.routes.ts
│   ├── availability.routes.ts
│   ├── booking.routes.ts
│   ├── invite.routes.ts
│   ├── room.routes.ts
│   ├── roomtype.routes.ts
│   └── user.routes.ts
├── utils/               # Helper functions
│   ├── amenity.mapper.ts
│   ├── booking.mapper.ts
│   ├── room.mapper.ts
│   ├── tokens.ts
│   └── index.ts
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          Register new user
POST   /api/v1/auth/login             Login user
POST   /api/v1/auth/logout            Logout user
```

### Rooms
```
GET    /api/v1/rooms                  Get all rooms
GET    /api/v1/rooms/:id              Get room by ID
POST   /api/v1/rooms                  Create room (admin)
PUT    /api/v1/rooms/:id              Update room (admin)
DELETE /api/v1/rooms/:id              Delete room (admin)
```

### Bookings
```
GET    /api/v1/bookings               Get user's bookings
GET    /api/v1/bookings/:id           Get booking details
POST   /api/v1/bookings               Create new booking
PUT    /api/v1/bookings/:id           Update booking
DELETE /api/v1/bookings/:id           Cancel booking
```

### Room Types
```
GET    /api/v1/roomtypes              Get all room types
POST   /api/v1/roomtypes              Create room type (admin)
PUT    /api/v1/roomtypes/:id          Update room type (admin)
DELETE /api/v1/roomtypes/:id          Delete room type (admin)
```

### Amenities
```
GET    /api/v1/amenities              Get all amenities
POST   /api/v1/amenities              Create amenity (admin)
PUT    /api/v1/amenities/:id          Update amenity (admin)
DELETE /api/v1/amenities/:id          Delete amenity (admin)
```

### Users
```
GET    /api/v1/users/:id              Get user profile
PUT    /api/v1/users/:id              Update user profile
```

### Invitations
```
POST   /api/v1/invitations            Send invitation (admin)
GET    /api/v1/invitations            Get invitations
POST   /api/v1/invitations/:id/accept Accept invitation
```

### Availability
```
GET    /api/v1/availability           Check room availability
POST   /api/v1/availability           Check availability for dates
```

### Health Check
```
GET    /api/v1/health                 Server health check
```

## 🗄️ Database Models

### User
```typescript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  profileImage: String,
  role: String (enum: ["user", "admin", "staff"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Room
```typescript
{
  roomNumber: Number (required, unique),
  roomType: ObjectId (ref: RoomType),
  capacity: Number (required),
  price: Number (required),
  description: String,
  amenities: [ObjectId] (ref: Amenity),
  images: [String],
  isAvailable: Boolean (default: true),
  createdAt: Date
}
```

### Booking
```typescript
{
  user: ObjectId (ref: User, required),
  room: ObjectId (ref: Room, required),
  checkInDate: Date (required),
  checkOutDate: Date (required),
  totalPrice: Number (required),
  status: String (enum: ["pending", "confirmed", "cancelled"]),
  createdAt: Date,
  updatedAt: Date
}
```

### RoomType
```typescript
{
  name: String (required),
  description: String,
  basePrice: Number (required),
  createdAt: Date
}
```

### Amenity
```typescript
{
  name: String (required),
  description: String,
  icon: String,
  createdAt: Date
}
```

### Invitation
```typescript
{
  email: String (required),
  role: String (enum: ["admin", "staff"]),
  status: String (enum: ["pending", "accepted", "rejected"]),
  createdAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Tokens issued on login, valid for 7 days
- Include in requests: `Authorization: Bearer <token>`
- Verified on protected routes using `authenticate` middleware

### Role-Based Access Control (RBAC)
- **user** - Can access only their own bookings
- **staff** - Can manage rooms and view bookings
- **admin** - Full system access

### Protected Routes Example
```typescript
// Only authenticated users
router.get('/my-bookings', authenticate, getMyBookings);

// Only admins
router.post('/rooms', authenticate, authorization(Role.ADMIN), createRoom);
```

## 📋 Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Detailed error message"
}
```

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `CORS_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRE`

## 🗄️ MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and login
3. Create a free cluster
4. Add IP address (0.0.0.0/0 for development)
5. Create database user with username/password
6. Get connection string
7. Add to `.env` as `MONGODB_URI`

Connection string format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

## 🌐 CORS Configuration

CORS is configured in `app.ts`:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

Update `CORS_ORIGIN` in `.env` for your frontend URL:
- Development: `http://localhost:5173`
- Production: `https://rad-course-work-hoterra-frontend.vercel.app`

## 🧪 Testing

```bash
npm test              # Run tests
npm test -- --watch   # Watch mode
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas includes your IP
- Ensure network connectivity

### CORS Errors
- Verify `CORS_ORIGIN` matches frontend URL exactly
- Check frontend is making requests to correct backend URL
- Restart server after .env changes

### JWT/Auth Errors
- Ensure token is included in `Authorization` header
- Check token format: `Bearer <token>`
- Verify `JWT_SECRET` is set and consistent

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using the port

## 📚 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run linter (if configured)
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/feature-name`
5. Create Pull Request

## 📄 License
MIT License

---

**Frontend Repository**: https://github.com/Seenathul-Ilma/RAD_CourseWork_Hoterra_Frontend
**Deployed Frontend**: https://rad-course-work-hoterra-frontend.vercel.app