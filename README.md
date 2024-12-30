Train Seat Reservation System
A full-stack Train Seat Reservation System that allows users to register, login, book, and cancel train seats. Admins can view all bookings and reset the reservation system.

Features
User Features
Register and Login: Users can register and log in to the system.
Seat Reservation: Book up to 7 seats at a time with priority for consecutive seats.
Cancel Reservations: View and cancel individual or bulk reservations.
Admin Features
View All Bookings: Admins can see all bookings made by users.
Reset All Reservations: Admins can clear the reservation system.
Technology Stack
Backend
Node.js: Backend runtime environment.
Express.js: Framework for RESTful APIs.
PostgreSQL: Database for storing user and reservation data.
Sequelize: ORM for database interactions.
Frontend
React.js: Frontend library for building user interfaces.
Material-UI: Component library for styling.
Deployment
AWS EC2: Hosting the backend server.
Netlify: Hosting the frontend React app.
Render DB: Hosting the PostgreSQL database.

Endpoints
Authentication
POST /api/v1/auth/register: Register a new user.
POST /api/v1/auth/login: Login as a user.
Seats
GET /api/v1/seats: Get all seats.
POST /api/v1/seats/reserve: Reserve seats.
POST /api/v1/seats/cancel: Cancel reservations.
Admin
GET /api/v1/admin/bookings: Get all user bookings.
POST /api/v1/admin/reset: Reset all reservations.
