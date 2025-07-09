import React, { useEffect, useState } from 'react'

type Account = {
  id: number
  username: string
  theme: string
}

type Content = {
  id: number
  caption: string
  hashtags: string
  image_url?: string
  video_url?: string
}

const ContentCreatorPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<number | ''>('')
  const [generated, setGenerated] = useState<Content | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then(setAccounts)
  }, [])

  const handleGenerate = async () => {
    if (!selected) return
    setLoading(true)
    const res = await fetch('/api/content/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: selected }),
    })
    if (res.ok) {
      const data = await res.json()
      setGenerated(data)
    } else {
      alert('Failed to generate content')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-semibold">AI Content Generator</h2>

      <div className="space-y-4 bg-white p-4 rounded shadow">
        <label className="block">
          <span className="text-sm">Select Account</span>
          <select
            className="mt-1 w-full border p-2 rounded"
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            <option value="">-- choose --</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.username} ({a.theme})
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={!selected || loading}
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate Post'}
        </button>
      </div>

      {generated && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          {generated.image_url && (
            <img src={generated.image_url} alt="generated" className="w-64 h-64 object-cover" />
          )}
          {generated.video_url && (
            <video controls className="w-64">
              <source src={generated.video_url} />
            </video>
          )}
          <p className="mt-2 whitespace-pre-line">{generated.caption}</p>
          <p className="text-sm text-gray-600">{generated.hashtags}</p>
        </div>
      )}
    </div>
  )
}

export default ContentCreatorPage