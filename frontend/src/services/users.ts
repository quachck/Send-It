import { Socket } from 'socket.io-client'
import io from 'socket.io-client'

const API_URL = 'http://localhost:3000/api'
let socket: Socket | null = null

interface User {
  username: string
  isOnline: boolean
  lastSeen: Date
}

// Initialize Socket.IO connection
const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3000')
    
    socket.on('connect', () => {
      console.log('🔌 Socket.IO: Connected to server')
    })

    socket.on('disconnect', () => {
      console.log('🔌 Socket.IO: Disconnected from server')
    })

    socket.on('userAdded', (user: User) => {
      console.log('👤 Socket.IO: User added:', user)
    })

    socket.on('userRemoved', (username: string) => {
      console.log('👤 Socket.IO: User removed:', username)
    })
  }
  return socket
}

// Function to get all users
export const getAllUsers = async (): Promise<string[]> => {
  try {
    console.log('🔍 getAllUsers: Fetching users from API')
    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const users: User[] = await response.json()
    console.log('📋 getAllUsers: Raw response:', users)
    
    // Map all usernames without filtering
    const allUsers = users.map(user => user.username)
    
    console.log('📋 getAllUsers: All users:', allUsers)
    return allUsers
  } catch (error) {
    console.error('❌ getAllUsers Error:', error)
    return []
  }
}

// Function to add a new user
export const addUser = async (username: string): Promise<void> => {
  try {
    console.log('➕ addUser: Adding user:', username)
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const user = await response.json()
    console.log('✅ addUser: User added successfully:', user)
  } catch (error) {
    console.error('❌ addUser Error:', error)
    throw error
  }
}

// Function to remove a user
export const removeUser = async (username: string): Promise<void> => {
  try {
    console.log('➖ removeUser: Removing user:', username)
    const response = await fetch(`${API_URL}/users/${username}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log('✅ removeUser: User removed successfully:', result)
  } catch (error) {
    console.error('❌ removeUser Error:', error)
    throw error
  }
}

// Function to check if a user exists
export const userExists = async (username: string): Promise<boolean> => {
  try {
    console.log('🔍 userExists: Checking user:', username)
    const response = await fetch(`${API_URL}/users/exists/${username}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('🔍 userExists:', username, data.exists)
    return data.exists
  } catch (error) {
    console.error('❌ userExists Error:', error)
    return false
  }
}

// Initialize Socket.IO and export the socket
export const getSocket = () => {
  return initializeSocket()
} 