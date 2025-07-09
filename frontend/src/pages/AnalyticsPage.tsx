import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js'

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip)

interface Account {
  id: number
  username: string
  theme: string
}

interface Analytics {
  total: number
  posted: number
  scheduled: number
  dates: string[]
  posted_counts: number[]
  scheduled_counts: number[]
}

export default function AnalyticsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<number | ''>('')
  const [data, setData] = useState<Analytics | null>(null)

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then(setAccounts)
  }, [])

  useEffect(() => {
    if (!selected) return
    fetch(`/api/analytics/${selected}`)
      .then((r) => r.json())
      .then(setData)
  }, [selected])

  const chartData = {
    labels: data?.dates,
    datasets: [
      {
        label: 'Posted',
        data: data?.posted_counts,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
      {
        label: 'Scheduled',
        data: data?.scheduled_counts,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.3,
      },
    ],
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold">Analytics</h2>

      <label className="block bg-white p-4 rounded shadow">
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

      {data && (
        <div className="space-y-4 bg-white p-4 rounded shadow">
          <div className="flex space-x-4">
            <Metric label="Total" value={data.total} />
            <Metric label="Posted" value={data.posted} />
            <Metric label="Scheduled" value={data.scheduled} />
          </div>
          <Line data={chartData} />
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}