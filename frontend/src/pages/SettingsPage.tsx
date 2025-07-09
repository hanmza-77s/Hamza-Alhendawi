import React, { useEffect, useState } from 'react'

interface Settings {
  openai_api_key: string
  proxies: string
  headless: boolean
}

export default function SettingsPage() {
  const [cfg, setCfg] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setCfg)
  }, [])

  const handleChange = (field: keyof Settings, value: any) => {
    if (!cfg) return
    setCfg({ ...cfg, [field]: value })
  }

  const save = async () => {
    if (!cfg) return
    setSaving(true)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    })
    setSaving(false)
    alert('Settings saved')
  }

  if (!cfg) return <p>Loading…</p>

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block text-sm">OpenAI API Key</label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            value={cfg.openai_api_key}
            onChange={(e) => handleChange('openai_api_key', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Proxy list (comma separated)</label>
          <input
            className="w-full border p-2 rounded"
            value={cfg.proxies}
            onChange={(e) => handleChange('proxies', e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={cfg.headless}
            onChange={(e) => handleChange('headless', e.target.checked)}
            id="headless"
          />
          <label htmlFor="headless" className="text-sm">Run browser in headless mode</label>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}