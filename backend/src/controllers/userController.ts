import { Request, Response } from 'express'
import User from '../models/User'

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
    console.log('Found users:', users)
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error })
  }
}

// Add a new user
export const addUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    
    // Check if user exists
    let user = await User.findOne({ username })
    if (user) {
      // Update existing user's status
      user.isOnline = true
      user.lastSeen = new Date()
      await user.save()
      console.log('Updated existing user:', user)
    } else {
      // Create new user
      user = new User({ 
        username,
        isOnline: true,
        lastSeen: new Date()
      })
      await user.save()
      console.log('Created new user:', user)
    }
    
    // Emit user added event through Socket.IO
    req.app.get('io').emit('userAdded', user)
    
    res.status(201).json(user)
  } catch (error) {
    console.error('Error adding user:', error)
    res.status(500).json({ message: 'Error adding user', error })
  }
}

// Remove a user (set offline)
export const removeUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isOnline = false
    user.lastSeen = new Date()
    await user.save()
    console.log('User set to offline:', user)

    // Emit user removed event through Socket.IO
    req.app.get('io').emit('userRemoved', username)

    res.json({ message: 'User set to offline', user })
  } catch (error) {
    console.error('Error removing user:', error)
    res.status(500).json({ message: 'Error removing user', error })
  }
}

// Check if user exists
export const userExists = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    const user = await User.findOne({ username })
    res.json({ exists: !!user })
  } catch (error) {
    res.status(500).json({ message: 'Error checking user', error })
  }
} 