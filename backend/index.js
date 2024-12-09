import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import boardRoutes from './routes/boards.js';
import './config/passport.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// Add these routes before the API routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Team Collaboration Board API',
    endpoints: {
      auth: '/api/auth',
      boards: '/api/boards'
    }
  });
});

// Add a catch-all route for undefined API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    availableEndpoints: {
      auth: '/api/auth',
      boards: '/api/boards'
    }
  });
});

// Add a general catch-all route for any other undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-board', (boardId) => {
    socket.join(`board-${boardId}`);
  });

  socket.on('update-board', (data) => {
    socket.to(`board-${data.boardId}`).emit('board-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});