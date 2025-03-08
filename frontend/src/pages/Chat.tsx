import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { getAllUsers, getSocket, removeUser } from '../services/users'
import { getUserMessages, sendMessage as sendMessageApi, setupMessageListeners, Message } from '../services/messages'
import UserList from '../components/UserList'

interface ChatProps {
  username: string
  onLogout: () => void
}

export default function Chat({ username, onLogout }: ChatProps) {
  console.log('🔄 Chat: Component initializing for user:', username)
  
  const navigate = useNavigate()
  const [recipient, setRecipient] = useState('')
  const [presetMessages, setPresetMessages] = useState<string[]>(() => {
    const saved = localStorage.getItem('presetMessages')
    return saved ? JSON.parse(saved) : ['Good morning', 'Hello', 'How are you?']
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [newPresetMessage, setNewPresetMessage] = useState('')
  const [availableUsers, setAvailableUsers] = useState<string[]>([])

  const loadUsers = async () => {
    try {
      const users = await getAllUsers()
      const filtered = users.filter(user => user !== username)
      console.log('👥 Chat: Available users:', filtered)
      setAvailableUsers(filtered)
    } catch (error) {
      console.error('❌ Chat: Error loading users:', error)
    }
  }

  const loadMessages = async () => {
    try {
      console.log('📨 Chat: Loading messages for user:', username)
      const userMessages = await getUserMessages(username)
      console.log('📨 Chat: Loaded messages:', userMessages)
      setMessages(userMessages)
    } catch (error) {
      console.error('❌ Chat: Error loading messages:', error)
    }
  }

  // Load initial users and messages
  useEffect(() => {
    loadUsers()
    loadMessages()
  }, [username])

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    console.log('🎧 Chat: Setting up socket listeners')
    const socket = getSocket()
    
    const handleUserUpdate = () => {
      loadUsers()
    }

    const cleanup = setupMessageListeners((newMessage: Message) => {
      console.log('📨 Chat: New message received:', newMessage)
      if (newMessage.sender === username || newMessage.recipient === username) {
        setMessages(prev => [newMessage, ...prev])
      }
    })

    socket.on('userAdded', handleUserUpdate)
    socket.on('userRemoved', handleUserUpdate)

    return () => {
      console.log('🧹 Chat: Cleaning up socket listeners')
      socket.off('userAdded', handleUserUpdate)
      socket.off('userRemoved', handleUserUpdate)
      cleanup()
    }
  }, [username])

  useEffect(() => {
    // Save preset messages to localStorage whenever they change
    localStorage.setItem('presetMessages', JSON.stringify(presetMessages))
  }, [presetMessages])

  const sendMessage = async (content: string) => {
    if (!recipient) {
      alert('Please select a recipient')
      return
    }

    const newMessage: Message = {
      sender: username,
      recipient,
      content,
      timestamp: Date.now()
    }

    try {
      await sendMessageApi(newMessage)
      // Message will be added to the list when received through Socket.IO
    } catch (error) {
      console.error('❌ Chat: Error sending message:', error)
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: `From: ${username}\nTo: ${recipient}\nMessage: ${content}`,
      })
    }
  }

  const addPresetMessage = () => {
    if (!newPresetMessage.trim()) return
    setPresetMessages(prev => [...prev, newPresetMessage.trim()])
    setNewPresetMessage('')
    setShowNewMessageModal(false)
  }

  const logout = () => {
    console.log('👋 Chat: User logging out:', username)
    // First update parent state and localStorage
    localStorage.removeItem('username')
    onLogout()
    
    // Then clean up in background
    removeUser(username).catch(error => {
      console.error('❌ Chat: Error during logout:', error)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-gray-900">Welcome, {username}!</h2>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">Select recipient...</option>
                {availableUsers.map((user: string) => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        <UserList currentUser={username} />

        {/* Preset Messages */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Preset Messages</h3>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add New Message
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {presetMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => sendMessage(message)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Message History</h3>
          <div className="space-y-4">
            {messages
              .filter(m => m.sender === username || m.recipient === username)
              .map(message => (
                <div
                  key={`${message.timestamp}-${message.sender}-${message.recipient}`}
                  className={`p-4 rounded-lg ${
                    message.sender === username
                      ? 'bg-primary-100 ml-auto'
                      : 'bg-gray-100'
                  } max-w-md`}
                >
                  <div className="text-sm text-gray-500">
                    {message.sender === username ? 'You' : message.sender} →{' '}
                    {message.recipient === username ? 'You' : message.recipient}
                  </div>
                  <div className="mt-1">{message.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Preset Message</h3>
                <input
                  type="text"
                  value={newPresetMessage}
                  onChange={(e) => setNewPresetMessage(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your message"
                />
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={addPresetMessage}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                >
                  Add Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewMessageModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 