import React, { useEffect, useState } from 'react'

interface Account {
  id: number
  username: string
  theme: string
}

interface Content {
  id: number
  caption: string
  scheduled_time?: string
  posted: boolean
}

const SchedulerPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<number | ''>('')
  const [queue, setQueue] = useState<Content[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then(setAccounts)
  }, [])

  useEffect(() => {
    if (!selected) return
    fetch(`/api/content/${selected}`)
      .then((r) => r.json())
      .then(setQueue)
  }, [selected])

  const runAutomation = async () => {
    await fetch('/api/scheduler/run', { method: 'POST' })
    // refresh queue
    if (selected) {
      const r = await fetch(`/api/content/${selected}`)
      setQueue(await r.json())
    }
  }

  const handleTimeChange = (id: number, value: string) => {
    setQueue((prev) =>
      prev.map((c) => (c.id === id ? { ...c, scheduled_time: value } : c))
    )
  }

  const saveChanges = async () => {
    setSaving(true)
    for (const c of queue) {
      await fetch(`/api/content/item/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduled_time: c.scheduled_time }),
      })
    }
    setSaving(false)
    alert('Saved!')
  }

  const formatISOToInput = (iso?: string) => {
    if (!iso) return ''
    return iso.slice(0, 16)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Scheduler</h2>

      <div className="bg-white p-4 rounded shadow space-y-4">
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
          onClick={runAutomation}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Run Automation Now
        </button>
      </div>

      {selected && (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Caption</th>
                <th className="text-left p-2">Scheduled Time (UTC)</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((q) => (
                <tr key={q.id} className="border-b">
                  <td className="p-2 max-w-xs truncate" title={q.caption}>{q.caption}</td>
                  <td className="p-2">
                    <input
                      type="datetime-local"
                      value={formatISOToInput(q.scheduled_time)}
                      onChange={(e) => handleTimeChange(q.id, e.target.value + ':00Z')}
                      className="border rounded p-1"
                      disabled={q.posted}
                    />
                  </td>
                  <td className="p-2">{q.posted ? 'Posted' : 'Scheduled'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Schedule'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SchedulerPage