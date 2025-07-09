import React, { useEffect, useState } from 'react'

interface Account {
  id: number
  username: string
  theme: string
  created_at: string
}

const HomePage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then((data) => {
        setAccounts(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading…</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Your Accounts</h2>

      {accounts.length === 0 && <p>No accounts yet. Use Create Account to get started!</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-4 rounded shadow space-y-2">
            <h3 className="text-lg font-semibold">@{acc.username}</h3>
            <p className="text-sm text-gray-600">Theme: {acc.theme}</p>
            <p className="text-xs text-gray-500">Created: {new Date(acc.created_at).toLocaleDateString()}</p>
            <a
              href={`/dashboard/content?account=${acc.id}`}
              className="inline-block text-blue-600 text-sm mt-2 hover:underline"
            >
              View Content →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage