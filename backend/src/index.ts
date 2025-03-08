import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes'
import messageRoutes from './routes/messageRoutes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Make io available in routes
app.set('io', io)

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/send-it'
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Start server
const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 