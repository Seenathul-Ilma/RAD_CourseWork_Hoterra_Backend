# 🔧 Hoterra Backend

A robust Node.js/Express API server for the Hoterra hotel management system. Handles user authentication, room management, bookings, and real-time availability checking with TypeScript and MongoDB.

![Node.js](https://img.shields.io/badge/node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-000000.svg?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black.svg?style=for-the-badge&logo=json-web-tokens&logoColor=white)

## 🌐 Live API

**Backend**: [https://rad-course-work-hoterra-backend.vercel.app](https://rad-course-work-hoterra-backend.vercel.app)

## 🛠️ Tech Stack

- **Node.js + Express**: Server framework for building RESTful APIs
- **TypeScript**: Type-safe development with static type checking
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB ODM for schema validation and data modeling
- **JWT (JSON Web Tokens)**: Secure authentication and authorization
- **CORS**: Cross-origin request handling
- **Cloudinary**: Cloud-based image upload and storage
- **Nodemailer**: Email service for staff invitations
- **bcryptjs**: Password hashing and security

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB Atlas account (free tier available)
- Cloudinary account (optional, for image uploads)
- Git for version control

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
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Environment Variable Descriptions:**
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment type (development/production)
- `MONGODB_URI`: MongoDB connection string with credentials
- `CORS_ORIGIN`: Frontend URL for CORS configuration
- `JWT_SECRET`: Secret key for signing JWT tokens (min 32 characters)
- `JWT_EXPIRE`: Token expiration time (e.g., 7d, 24h)
- `CLOUDINARY_NAME`: Cloudinary cloud name for image uploads
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `EMAIL_USER`: Gmail address for sending invitations
- `EMAIL_PASSWORD`: Gmail app-specific password (not account password)

### Run Development Server

```bash
npm run dev
```

Server will run at `http://localhost:5000`

---

## 📂 Project Structure

```
src/
├── config/                              # Configuration files
│   ├── cloudinary.ts                    # Cloudinary image upload configuration
│   └── transporter.ts                   # Nodemailer email service setup
├── controllers/                         # Route handlers (business logic)
│   ├── ai.controller.ts                 # AI-related endpoint handlers
│   ├── amenity.controller.ts            # Amenity CRUD operations
│   │   ├── getAllAmenities()            # Fetch all amenities
│   │   ├── createAmenity()              # Create new amenity
│   │   ├── updateAmenity()              # Update amenity details
│   │   └── deleteAmenity()              # Delete amenity
│   ├── auth.controller.ts               # Authentication logic
│   │   ├── register()                   # User registration
│   │   ├── login()                      # User login & JWT issuance
│   │   └── logout()                     # User logout
│   ├── availability.controller.ts       # Room availability checking
│   │   └── checkAvailability()          # Check room availability for dates
│   ├── booking.controller.ts            # Booking operations
│   │   ├── createBooking()              # Create new booking
│   │   ├── getUserBookings()            # Get user's bookings
│   │   ├── getBookingById()             # Get booking details
│   │   ├── getAllBookings()             # Get all bookings (admin)
│   │   ├── updateBooking()              # Update booking status
│   │   └── cancelBooking()              # Cancel booking
│   ├── invite.controller.ts             # Staff invitation logic
│   │   ├── sendInvitation()             # Send email invitation
│   │   ├── getInvitations()             # Get pending invitations
│   │   └── acceptInvitation()           # Accept invitation with token
│   ├── room.controller.ts               # Room management
│   │   ├── getAllRooms()                # Fetch all rooms
│   │   ├── getRoomById()                # Get room details
│   │   ├── createRoom()                 # Create new room
│   │   ├── updateRoom()                 # Update room info
│   │   └── deleteRoom()                 # Delete room
│   ├── roomtype.controller.ts           # Room type management
│   │   ├── getAllRoomTypes()            # Fetch all room types
│   │   ├── createRoomType()             # Create new type
│   │   ├── updateRoomType()             # Update type details
│   │   └── deleteRoomType()             # Delete room type
│   └── user.controller.ts               # User profile management
│       ├── getUserProfile()             # Get user details
│       └── updateUserProfile()          # Update user info
├── middlewares/                         # Custom middleware functions
│   ├── auth.ts                          # JWT verification middleware
│   │   └── authenticate()               # Check JWT token validity
│   ├── roles.ts                         # Role-based authorization
│   │   └── authorization()              # Check user role permissions
│   └── upload.ts                        # File upload handling
│       └── uploadImage()                # Handle image uploads to Cloudinary
├── models/                              # MongoDB Mongoose schemas
│   ├── Amenity.ts                       # Amenity schema definition
│   ├── Booking.ts                       # Booking schema definition
│   ├── Invitation.ts                    # Staff invitation schema
│   ├── Room.ts                          # Room schema definition
│   ├── RoomAmenity.ts                   # Room-amenity relationship
│   ├── RoomType.ts                      # Room type schema definition
│   └── User.ts                          # User account schema
├── routes/                              # API endpoint definitions
│   ├── amenity.routes.ts                # Amenity endpoints
│   │   ├── GET /                        # Get all amenities
│   │   ├── POST /                       # Create amenity (admin)
│   │   ├── PUT /:id                     # Update amenity (admin)
│   │   └── DELETE /:id                  # Delete amenity (admin)
│   ├── auth.routes.ts                   # Authentication endpoints
│   │   ├── POST /register               # User registration
│   │   ├── POST /login                  # User login
│   │   └── POST /logout                 # User logout
│   ├── availability.routes.ts           # Availability endpoints
│   │   ├── GET /                        # Check availability
│   │   └── POST /                       # Check availability for date range
│   ├── booking.routes.ts                # Booking endpoints
│   │   ├── GET /                        # Get user's bookings
│   │   ├── GET /:id                     # Get booking details
│   │   ├── POST /                       # Create booking
│   │   ├── PUT /:id                     # Update booking
│   │   └── DELETE /:id                  # Cancel booking
│   ├── invite.routes.ts                 # Invitation endpoints
│   │   ├── POST /                       # Send invitation
│   │   ├── GET /                        # Get invitations
│   │   └── POST /:id/accept             # Accept invitation
│   ├── room.routes.ts                   # Room endpoints
│   │   ├── GET /                        # Get all rooms
│   │   ├── GET /:id                     # Get room by ID
│   │   ├── POST /                       # Create room (admin)
│   │   ├── PUT /:id                     # Update room (admin)
│   │   └── DELETE /:id                  # Delete room (admin)
│   ├── roomtype.routes.ts               # Room type endpoints
│   │   ├── GET /                        # Get all types
│   │   ├── POST /                       # Create type (admin)
│   │   ├── PUT /:id                     # Update type (admin)
│   │   └── DELETE /:id                  # Delete type (admin)
│   └── user.routes.ts                   # User profile endpoints
│       ├── GET /:id                     # Get user profile
│       └── PUT /:id                     # Update user profile
├── utils/                               # Helper functions & utilities
│   ├── amenity.mapper.ts                # Transform amenity data
│   ├── booking.mapper.ts                # Transform booking data
│   ├── room.mapper.ts                   # Transform room data
│   ├── tokens.ts                        # JWT token generation & verification
│   └── index.ts                         # Export utility functions
├── app.ts                               # Express app setup & middleware config
└── server.ts                            # Server entry point & listener
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          Register new user
                                      Body: { firstName, lastName, email, password, phone }
                                      Response: { user, token }

POST   /api/v1/auth/login             Login user and get JWT token
                                      Body: { email, password }
                                      Response: { user, token }

POST   /api/v1/auth/logout            Logout user
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { success: true }
```

### Rooms
```
GET    /api/v1/rooms                  Get all rooms with details
                                      Response: { rooms: [] }

GET    /api/v1/rooms/:id              Get specific room by ID
                                      Response: { room }

POST   /api/v1/rooms                  Create new room (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { roomNumber, roomType, capacity, price, ... }
                                      Response: { room }

PUT    /api/v1/rooms/:id              Update room information (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { Updated room fields }
                                      Response: { room }

DELETE /api/v1/rooms/:id              Delete room (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { success: true }
```

### Bookings
```
GET    /api/v1/bookings               Get user's bookings (authenticated)
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { bookings: [] }

GET    /api/v1/bookings/:id           Get specific booking details
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { booking }

POST   /api/v1/bookings               Create new booking
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { room, checkInDate, checkOutDate, ... }
                                      Response: { booking }

PUT    /api/v1/bookings/:id           Update booking status
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { status, ... }
                                      Response: { booking }

DELETE /api/v1/bookings/:id           Cancel booking
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { success: true }
```

### Room Types
```
GET    /api/v1/roomtypes              Get all room types
                                      Response: { roomTypes: [] }

POST   /api/v1/roomtypes              Create room type (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { name, description, basePrice }
                                      Response: { roomType }

PUT    /api/v1/roomtypes/:id          Update room type (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { Updated fields }
                                      Response: { roomType }

DELETE /api/v1/roomtypes/:id          Delete room type (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { success: true }
```

### Amenities
```
GET    /api/v1/amenities              Get all amenities
                                      Response: { amenities: [] }

POST   /api/v1/amenities              Create amenity (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { name, description, icon }
                                      Response: { amenity }

PUT    /api/v1/amenities/:id          Update amenity (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { Updated fields }
                                      Response: { amenity }

DELETE /api/v1/amenities/:id          Delete amenity (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { success: true }
```

### Users
```
GET    /api/v1/users/:id              Get user profile information
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { user }

PUT    /api/v1/users/:id              Update user profile details
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { firstName, lastName, phone, ... }
                                      Response: { user }
```

### Staff Invitations
```
POST   /api/v1/invitations            Send staff invitation via email (admin)
                                      Headers: { Authorization: Bearer <token> }
                                      Body: { email, role }
                                      Response: { invitation }

GET    /api/v1/invitations            Get pending invitations
                                      Headers: { Authorization: Bearer <token> }
                                      Response: { invitations: [] }

POST   /api/v1/invitations/:id/accept Accept invitation with token
                                      Body: { token, firstName, lastName, password, ... }
                                      Response: { user, token }
```

### Availability
```
GET    /api/v1/availability           Check room availability status
                                      Query: { roomId, checkInDate, checkOutDate }
                                      Response: { available: boolean }

POST   /api/v1/availability           Check availability for date range
                                      Body: { checkInDate, checkOutDate }
                                      Response: { availableRooms: [] }
```

### Health Check
```
GET    /api/v1/health                 Server health and status check
                                      Response: { status: "OK", timestamp }
```

---

## 🗄️ Database Models

### User Schema
```typescript
{
  _id: ObjectId (auto-generated),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  phone: String (optional),
  profileImage: String (Cloudinary URL, optional),
  role: String (enum: ["user", "admin", "staff"], default: "user"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Room Schema
```typescript
{
  _id: ObjectId (auto-generated),
  roomNumber: Number (required, unique),
  roomType: ObjectId (reference to RoomType),
  capacity: Number (required),
  price: Number (required),
  description: String (optional),
  amenities: [ObjectId] (references to Amenity),
  images: [String] (Cloudinary URLs),
  isAvailable: Boolean (default: true),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Booking Schema
```typescript
{
  _id: ObjectId (auto-generated),
  user: ObjectId (reference to User, required),
  room: ObjectId (reference to Room, required),
  checkInDate: Date (required),
  checkOutDate: Date (required),
  totalPrice: Number (calculated),
  numberOfNights: Number (calculated),
  status: String (enum: ["pending", "confirmed", "cancelled"], default: "pending"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### RoomType Schema
```typescript
{
  _id: ObjectId (auto-generated),
  name: String (required, unique),
  description: String (optional),
  basePrice: Number (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Amenity Schema
```typescript
{
  _id: ObjectId (auto-generated),
  name: String (required, unique),
  description: String (optional),
  icon: String (Lucide icon name, optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Invitation Schema
```typescript
{
  _id: ObjectId (auto-generated),
  email: String (required, unique),
  role: String (enum: ["admin", "staff"]),
  status: String (enum: ["pending", "accepted", "rejected"], default: "pending"),
  token: String (unique, secure random token),
  createdAt: Date (auto-generated),
  expiresAt: Date (invitation expiration),
  acceptedAt: Date (when invitation was accepted)
}
```

### RoomAmenity Schema
```typescript
{
  _id: ObjectId (auto-generated),
  room: ObjectId (reference to Room),
  amenity: ObjectId (reference to Amenity),
  createdAt: Date (auto-generated)
}
```

---

## 🔐 Authentication & Authorization

### JWT Authentication

The backend uses JWT (JSON Web Tokens) for stateless authentication:

1. User logs in with email and password
2. Backend validates credentials against hashed password
3. If valid, server generates JWT token with 7-day expiration
4. Token is returned to frontend and stored
5. Token is sent in `Authorization` header for protected routes
6. Backend verifies token on each request using `authenticate` middleware

### JWT Token Structure
```
Authorization: Bearer <header>.<payload>.<signature>
```

**Token Payload:**
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "user|admin|staff",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Role-Based Access Control (RBAC)

Three user roles with different permissions:

**User Role:**
- Can view rooms and room details
- Can make bookings
- Can view only their own bookings
- Can update own profile
- Cannot access admin features

**Staff Role:**
- All user permissions
- Can view all bookings (not just their own)
- Can update booking status
- Cannot create/modify rooms or amenities

**Admin Role:**
- All permissions
- Can create, update, delete rooms
- Can create, update, delete room types
- Can create, update, delete amenities
- Can invite new staff members
- Can view all system data
- Can manage user roles

### Middleware Implementation

```typescript
// Authenticate middleware - verifies JWT token
router.get('/bookings', authenticate, getMyBookings);

// Authorization middleware - checks user role
router.post('/rooms', authenticate, authorization(Role.ADMIN), createRoom);

// Multiple roles
router.get('/all-bookings', authenticate, authorization(Role.ADMIN, Role.STAFF), getAllBookings);
```

---

## 🔌 Controllers & Services

### Authentication Controller (`auth.controller.ts`)

Handles user registration, login, and logout operations.

**register()**
- Validates input data
- Checks if email already exists
- Hashes password using bcrypt
- Creates new user in database
- Generates JWT token
- Returns user object and token

**login()**
- Validates email and password
- Retrieves user from database
- Compares password with hash
- Generates JWT token if credentials valid
- Returns user object and token
- Returns error if credentials invalid

**logout()**
- Clears user session
- Returns success confirmation

### Room Controller (`room.controller.ts`)

Manages all room operations and data.

**getAllRooms()**
- Queries all rooms from database
- Populates room type and amenities
- Returns array of room objects

**getRoomById(id)**
- Finds room by ID
- Populates related data (type, amenities)
- Returns single room object
- Returns error if room not found

**createRoom() [Admin]**
- Validates input data
- Creates new room document
- Associates room with type and amenities
- Uploads images to Cloudinary if provided
- Returns created room

**updateRoom() [Admin]**
- Finds existing room
- Updates specified fields
- Handles image uploads/replacements
- Returns updated room

**deleteRoom() [Admin]**
- Finds and deletes room
- Removes associated booking records
- Returns success confirmation

### Booking Controller (`booking.controller.ts`)

Handles booking creation and management.

**createBooking()**
- Validates check-in and check-out dates
- Checks room availability for dates
- Validates room capacity
- Calculates number of nights
- Calculates total price
- Creates booking document
- Updates room availability status
- Returns booking confirmation

**getUserBookings()**
- Gets bookings for authenticated user
- Populates room and user data
- Sorts by date
- Returns user's bookings array

**getAllBookings() [Admin/Staff]**
- Retrieves all bookings in system
- Supports filtering and pagination
- Populates user and room details
- Returns all bookings array

**updateBooking() [Admin/Staff]**
- Updates booking status
- Validates status transitions
- Recalculates prices if needed
- Returns updated booking

**cancelBooking()**
- Sets booking status to cancelled
- Frees up room availability
- Returns cancellation confirmation

### Availability Controller (`availability.controller.ts`)

Checks room availability for date ranges.

**checkAvailability()**
- Queries bookings for room in date range
- Checks for booking conflicts
- Returns availability status
- Used during booking process

### Invitation Controller (`invite.controller.ts`)

Manages staff invitations and registrations.

**sendInvitation() [Admin]**
- Validates email address
- Generates unique invitation token
- Sets expiration date
- Sends invitation email with token link
- Creates invitation record
- Returns invitation object

**acceptInvitation()**
- Validates invitation token
- Checks if invitation expired
- Creates new user account with specified role
- Sets status to accepted
- Returns user and JWT token

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

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
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_USER`
- `EMAIL_PASSWORD`

---

## 🗄️ MongoDB Atlas Setup

1. Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and login
3. Create a new free cluster
4. Add your IP address to the whitelist (use 0.0.0.0/0 for development)
5. Create a database user with secure username and password
6. Get the connection string from cluster
7. Replace placeholders in connection string
8. Add to backend `.env` as `MONGODB_URI`

**Connection String Format:**
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Connection String Example:**
```
mongodb+srv://hoterra_user:mySecurePassword123@hoterra-cluster.mongodb.net/hoterra?retryWrites=true&w=majority
```

---

## ☁️ Cloudinary Setup (Optional, for Image Uploads)

1. Visit [https://cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Go to Dashboard to get credentials
4. Copy Cloud Name, API Key, and API Secret
5. Add to `.env`:
   ```env
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 📧 Email Setup (Gmail for Invitations)

1. Use Gmail account for sending invitations
2. Enable 2-Factor Authentication
3. Generate App Password (not account password)
4. Add to `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

---

## 🌐 CORS Configuration

CORS is configured in `app.ts`:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Update `CORS_ORIGIN` in `.env` for your frontend URL:
- **Development**: `http://localhost:5173`
- **Production**: `https://rad-course-work-hoterra-frontend.vercel.app`

The backend will reject requests from non-whitelisted origins.

---

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
  "message": "Detailed error message explaining what went wrong"
}
```

### Common Error Codes
```
VALIDATION_ERROR      - Invalid input data
AUTHENTICATION_ERROR  - Missing or invalid JWT token
AUTHORIZATION_ERROR   - User lacks required permissions
NOT_FOUND            - Resource not found
CONFLICT             - Data conflict (e.g., duplicate email)
SERVER_ERROR         - Internal server error
```

---

## 📚 Available Scripts

```bash
npm run dev      # Start development server with auto-reload (ts-node)
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm test         # Run test suite (if configured)
npm run lint     # Run linter
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env` is correct with proper credentials
- Check IP whitelist in MongoDB Atlas includes your IP
- Ensure cluster is active and running
- Test connection by connecting with MongoDB Compass
- Verify database user has proper permissions
- Check for special characters in password (URL encode if needed)

**MongoDB Connection String Issues:**
```
// ❌ Wrong - missing credentials
mongodb+srv://cluster.mongodb.net/database

// ✅ Correct - includes credentials
mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### CORS Errors (Access blocked by CORS policy)
- Verify `CORS_ORIGIN` in `.env` matches frontend URL exactly
- Check frontend URL includes protocol (http:// or https://)
- For development: `http://localhost:5173`
- For production: `https://rad-course-work-hoterra-frontend.vercel.app`
- Restart server after `.env` changes
- Browser won't cache CORS - check server logs

### JWT/Authentication Errors
- Verify `JWT_SECRET` in `.env` is set (minimum 32 characters)
- Check token format is correct: `Authorization: Bearer <token>`
- Verify token hasn't expired (default 7 days)
- Ensure middleware is applied to protected routes
- Check token is generated correctly on login

**Token Debug:**
```typescript
// Decode JWT to check payload
const decoded = jwt.decode(token);
console.log(decoded);
```

### Email Invitation Not Sending
- Verify Gmail account has 2FA enabled
- Check using App Password (not account password)
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Check for Gmail security blocks (recent sign-in attempts)
- Ensure Nodemailer transporter is configured correctly
- Check email address format is valid

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password (16 character password)
3. Use in `EMAIL_PASSWORD` (not your actual Gmail password)

### Database/Collection Issues
- Verify database name in connection string
- Check that collections exist in MongoDB
- Create indexes for frequently queried fields
- Monitor MongoDB Atlas for quota/storage issues
- Check user permissions in MongoDB (read/write)

### Image Upload to Cloudinary Fails
- Verify Cloudinary credentials are correct
- Check API Key and Secret in `.env`
- Ensure Cloudinary account is active
- Check available storage quota
- Verify file size isn't exceeding limits
- Check file format is supported

### Port Already in Use
- Change `PORT` in `.env` to available port (e.g., 5001)
- Or kill process using port:
  - **macOS/Linux**: `lsof -ti:5000 | xargs kill -9`
  - **Windows**: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

### TypeScript Compilation Errors
- Check for type errors: `npx tsc --noEmit`
- Verify all imports have correct paths
- Check tsconfig.json configuration
- Ensure all dependencies are typed
- Look for missing return types in functions

### Server Crashes on Startup
- Check for syntax errors in code
- Verify all required environment variables are set
- Check MongoDB connection can be established
- Review console error messages
- Check for infinite loops or blocking operations

### Routes Not Working (404 Errors)
- Verify route paths are correct in routes files
- Check routes are registered in app.ts
- Ensure middleware is applied in correct order
- Check method is correct (GET, POST, etc.)
- Verify API prefix `/api/v1` is included in requests

### Data Not Persisting to Database
- Verify MongoDB connection is active
- Check database operations are awaited
- Ensure data validation passes
- Check Mongoose schemas match data
- Verify collection permissions are correct

---

## 🧪 Testing

```bash
npm test              # Run test suite
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage # Generate coverage report
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m 'Add feature description'`
4. Push to branch: `git push origin feature/feature-name`
5. Create a Pull Request with detailed description of changes

---

## 📝 License

### License 1: Academic and Personal Learning License
This project is © 2026 Zeenathul Ilma. It is not open-source and may not be reused or copied without permission.

This project was created and developed by Zeenathul Ilma as part of academic and personal learning initiatives. All rights reserved. No part of this project may be copied, reused, or distributed without written permission from the author.

🚫 Copying or reusing this code without permission is strictly prohibited and may result in academic consequences.

### License 2: Proprietary License
This project is licensed under a Proprietary License. See [LICENSE.txt](LICENSE.txt) for details.

---

## 👩‍💻 Author

**Zeenathul Ilma**
- GitHub: [@Seenathul-Ilma](https://github.com/Seenathul-Ilma)
- Portfolio: [zeenathulilma.vercel.app](https://zeenathulilma.vercel.app)
- Email: Contact via GitHub profile

---

## 📚 Related Repositories

- **Frontend Repository**: [RAD_CourseWork_Hoterra_Frontend](https://github.com/Seenathul-Ilma/RAD_CourseWork_Hoterra_Frontend)
- **Deployed Frontend**: [https://rad-course-work-hoterra-frontend.vercel.app](https://rad-course-work-hoterra-frontend.vercel.app)

---

## 🎓 Project Context

Hoterra Backend was developed as part of a comprehensive coursework project demonstrating enterprise-level backend development skills including:

- **RESTful API Design**: Proper HTTP methods, status codes, and response formats
- **Database Design**: Schema design, relationships, indexing strategies
- **Authentication & Security**: JWT implementation, password hashing, RBAC
- **Error Handling**: Comprehensive error handling and logging
- **Middleware Architecture**: Custom middleware for auth, validation, file uploads
- **Code Organization**: Clean architecture with separation of concerns
- **Type Safety**: TypeScript for compile-time type checking
- **Cloud Integration**: Cloudinary for images, MongoDB Atlas for database
- **Email Services**: Nodemailer for sending invitations
- **API Documentation**: Clear endpoint documentation and examples
- **Deployment**: Vercel serverless deployment with environment management

For questions or support, please refer to the GitHub repository or contact the author directly.