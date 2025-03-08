import { useState, FormEvent, useEffect } from 'react'
import React from 'react'
import { addUser, userExists, getAllUsers } from '../services/users'

interface LoginProps {
  onLogin: (username: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  console.log('🔄 Login: Component initializing')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check current users on mount
    getAllUsers().then(users => {
      console.log('👥 Login: Current users:', users)
    })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('📝 Login: Form submitted')
    
    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      console.log('❌ Login: Empty username')
      setError('Username is required')
      return
    }

    try {
      console.log('🔍 Login: Checking if user exists:', trimmedUsername)
      // If user exists, just log them in
      const exists = await userExists(trimmedUsername)
      if (exists) {
        console.log('✅ Login: Existing user logging in:', trimmedUsername)
        onLogin(trimmedUsername)
        return
      }

      // Add new user
      console.log('➕ Login: Adding new user:', trimmedUsername)
      await addUser(trimmedUsername)
      
      console.log('✅ Login: New user created and logging in:', trimmedUsername)
      onLogin(trimmedUsername)
    } catch (err) {
      console.error('❌ Login Error:', err)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Send It
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your name to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Start Chatting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 