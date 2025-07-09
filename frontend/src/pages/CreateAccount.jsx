import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Instagram, Play, Check, AlertCircle } from 'lucide-react'
import { accountsAPI } from '../services/api'

const themes = [
  { id: 'boxing', name: 'Boxing', icon: '🥊', description: 'Combat sports, training, motivation' },
  { id: 'health', name: 'Health & Wellness', icon: '🏥', description: 'Fitness, nutrition, mental health' },
  { id: 'motivation', name: 'Motivation', icon: '🔥', description: 'Inspirational quotes, success stories' },
  { id: 'fitness', name: 'Fitness', icon: '💪', description: 'Workouts, gym life, strength training' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '✨', description: 'Daily life, travel, personal growth' },
  { id: 'business', name: 'Business', icon: '💼', description: 'Entrepreneurship, productivity, success' },
  { id: 'food', name: 'Food & Cooking', icon: '🍳', description: 'Recipes, food photography, cooking tips' },
  { id: 'travel', name: 'Travel', icon: '✈️', description: 'Travel photography, destinations, experiences' },
]

export default function CreateAccount() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    setLoading(true)
    try {
      const response = await accountsAPI.getAll()
      setAccounts(response.data.accounts)
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    if (!selectedTheme) {
      toast.error('Please select a theme for your account')
      return
    }

    setCreating(true)
    try {
      const response = await accountsAPI.create({
        username: data.username,
        password: data.password,
        theme: selectedTheme,
        platform: data.platform || 'instagram'
      })

      if (response.data.success) {
        toast.success('Account created successfully! AI strategy generated.')
        reset()
        setSelectedTheme('')
        loadAccounts()
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create account')
    } finally {
      setCreating(false)
    }
  }

  const loginAccount = async (accountId) => {
    try {
      const response = await accountsAPI.login(accountId)
      if (response.data.success) {
        toast.success('Account login simulated successfully!')
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      toast.error('Failed to login account')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
        <p className="text-gray-600 mt-1">Create and manage your AI-powered social media accounts</p>
      </div>

      {/* Create New Account Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Platform</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  {...register('platform')}
                  value="instagram"
                  defaultChecked
                  className="text-primary-600"
                />
                <Instagram className="h-6 w-6 text-pink-600" />
                <div>
                  <span className="font-medium text-gray-900">Instagram</span>
                  <p className="text-sm text-gray-500">Photo and video sharing</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  {...register('platform')}
                  value="tiktok"
                  className="text-primary-600"
                />
                <Play className="h-6 w-6 text-gray-900" />
                <div>
                  <span className="font-medium text-gray-900">TikTok</span>
                  <p className="text-sm text-gray-500">Short form videos</p>
                </div>
              </label>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="input"
                placeholder="your_username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTheme === theme.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{theme.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Demo Mode</h3>
              <p className="text-sm text-amber-700 mt-1">
                This is a demonstration. In production, implement proper authentication, 
                credential encryption, and secure storage practices.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={creating || !selectedTheme}
            className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating Account...' : 'Create AI Account'}
          </button>
        </form>
      </div>

      {/* Existing Accounts */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Accounts</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8">
            <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
            <p className="text-gray-500">Create your first AI-powered social media account above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {account.platform === 'instagram' ? (
                    <Instagram className="h-6 w-6 text-pink-600" />
                  ) : (
                    <Play className="h-6 w-6 text-gray-900" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">@{account.username}</h3>
                    <p className="text-sm text-gray-500 capitalize">{account.platform}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Theme:</span>
                    <span className="font-medium text-gray-900 capitalize">{account.theme}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`flex items-center space-x-1 ${
                      account.is_active ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        account.is_active ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span>{account.is_active ? 'Active' : 'Inactive'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-900">
                      {new Date(account.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => loginAccount(account.id)}
                    className="btn btn-primary flex-1 text-sm py-2"
                  >
                    Test Login
                  </button>
                  <button className="btn btn-outline text-sm py-2">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}