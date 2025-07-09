import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import HomePage from './pages/HomePage'
import CreateAccountPage from './pages/CreateAccountPage'
import ContentCreatorPage from './pages/ContentCreatorPage'
import SchedulerPage from './pages/SchedulerPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import WelcomeScreen from './components/WelcomeScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/dashboard" element={<DashboardLayout />}> 
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreateAccountPage />} />
          <Route path="content" element={<ContentCreatorPage />} />
          <Route path="scheduler" element={<SchedulerPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  )
}