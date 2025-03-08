import { Request, Response } from 'express'
import Message from '../models/Message'

// Get messages for a user
export const getUserMessages = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    const messages = await Message.find({
      $or: [
        { sender: username },
        { recipient: username }
      ]
    }).sort({ timestamp: -1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error })
  }
}

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender, recipient, content } = req.body
    const message = new Message({
      sender,
      recipient,
      content,
      timestamp: Date.now()
    })
    await message.save()
    
    // Emit message event through Socket.IO
    req.app.get('io').emit('newMessage', message)
    
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error })
  }
} 