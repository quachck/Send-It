import { getSocket } from './users'

const API_URL = 'http://localhost:3000/api'

export interface Message {
  id?: string
  sender: string
  recipient: string
  content: string
  timestamp: number
}

// Get messages for a user
export const getUserMessages = async (username: string): Promise<Message[]> => {
  try {
    console.log('🔍 getMessages: Fetching messages for user:', username)
    const response = await fetch(`${API_URL}/messages/${username}`)
    const messages = await response.json()
    console.log('📋 getMessages: Found messages:', messages)
    return messages
  } catch (error) {
    console.error('❌ getMessages Error:', error)
    return []
  }
}

// Send a new message
export const sendMessage = async (message: Message): Promise<void> => {
  try {
    console.log('📤 sendMessage: Sending message:', message)
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    })
    const result = await response.json()
    console.log('✅ sendMessage: Message sent successfully:', result)
  } catch (error) {
    console.error('❌ sendMessage Error:', error)
  }
}

// Set up message listeners
export const setupMessageListeners = (onNewMessage: (message: Message) => void) => {
  const socket = getSocket()
  
  socket.on('newMessage', (message: Message) => {
    console.log('📨 Socket.IO: New message received:', message)
    onNewMessage(message)
  })

  return () => {
    socket.off('newMessage')
  }
} 