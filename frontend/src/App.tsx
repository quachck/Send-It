import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Chat from './pages/Chat'

function App() {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'))

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={
              username ? (
                <Navigate to="/chat" replace />
              ) : (
                <Login onLogin={(name: string) => {
                  localStorage.setItem('username', name)
                  setUsername(name)
                }} />
              )
            } 
          />
          <Route 
            path="/chat" 
            element={
              username ? (
                <Chat 
                  username={username} 
                  onLogout={() => setUsername(null)}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App 