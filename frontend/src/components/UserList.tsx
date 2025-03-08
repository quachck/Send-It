import { useState, useEffect } from 'react'
import React from 'react'
import { getAllUsers, getSocket } from '../services/users'

interface UserListProps {
  currentUser: string
}

export default function UserList({ currentUser }: UserListProps) {
  const [users, setUsers] = useState<string[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [socketStatus, setSocketStatus] = useState<string>('connecting')

  const loadUsers = async () => {
    try {
      console.log('🔍 UserList: Fetching all users')
      const allUsers = await getAllUsers()
      console.log('📋 UserList: Current users in system:', allUsers)
      setUsers(allUsers)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('❌ UserList: Error loading users:', error)
    }
  }

  useEffect(() => {
    console.log('🔄 UserList: Component initializing')
    const socket = getSocket()

    // Initial load
    loadUsers()

    // Set up Socket.IO event listeners
    socket.on('connect', () => {
      console.log('🔌 UserList: Socket connected')
      setSocketStatus('connected')
      loadUsers()
    })

    socket.on('disconnect', () => {
      console.log('🔌 UserList: Socket disconnected')
      setSocketStatus('disconnected')
    })

    socket.on('userAdded', () => {
      console.log('👤 UserList: User added, refreshing list')
      loadUsers()
    })

    socket.on('userRemoved', () => {
      console.log('👤 UserList: User removed, refreshing list')
      loadUsers()
    })

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      console.log('🔄 UserList: Performing periodic refresh')
      loadUsers()
    }, 10000)

    return () => {
      console.log('🧹 UserList: Cleaning up')
      socket.off('connect')
      socket.off('disconnect')
      socket.off('userAdded')
      socket.off('userRemoved')
      clearInterval(refreshInterval)
    }
  }, [])

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Debug Information</h3>
        <div className="mt-2 text-sm text-gray-500">
          <p>Current User: {currentUser}</p>
          <p>Total Users: {users.length}</p>
          <p>Last Update: {lastUpdate.toLocaleString()}</p>
          <p>Socket Status: {socketStatus}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-900">All Users</h4>
        <div className="mt-2 space-y-2">
          {users.length === 0 ? (
            <div className="text-sm text-gray-500">No users found</div>
          ) : (
            users.map(user => (
              <div 
                key={user} 
                className={`p-2 rounded ${user === currentUser ? 'bg-primary-100' : 'bg-gray-50'}`}
              >
                {user} {user === currentUser && '(you)'}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-900">Component State</h4>
        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
          {JSON.stringify({ users, lastUpdate, socketStatus }, null, 2)}
        </pre>
      </div>
    </div>
  )
} 