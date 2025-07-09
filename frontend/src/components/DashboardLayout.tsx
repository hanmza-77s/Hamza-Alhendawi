import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Home' },
  { to: '/dashboard/create', label: 'Create Account' },
  { to: '/dashboard/content', label: 'Content Creator' },
  { to: '/dashboard/scheduler', label: 'Scheduler' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/settings', label: 'Settings' },
]

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">AutoSocial</div>
        <nav className="p-4 space-y-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
              }
              end={l.to === '/dashboard'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}