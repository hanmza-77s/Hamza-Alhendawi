import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WelcomeScreen: React.FC = () => {
  const [theme, setTheme] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('/api/account/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, username, password }),
    })
    if (res.ok) {
      setSuccess(true)
      navigate('/dashboard')
    } else {
      alert('Failed to create account')
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">🎉 Account created!</h2>
        <p>Head over to the dashboard to see your AI generated posts.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 space-y-4">
      <h1 className="text-3xl font-bold text-center">AutoSocial</h1>
      <input
        className="w-full border p-2 rounded"
        placeholder="Theme (e.g. boxing)"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Instagram username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Instagram password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Start AI Account
      </button>
    </form>
  )
}

export default WelcomeScreen