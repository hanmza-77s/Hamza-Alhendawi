import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Bot, Sparkles, Zap, Target, ArrowRight, Instagram, Play } from 'lucide-react'
import { accountsAPI } from '../services/api'

const themes = [
  { id: 'boxing', name: 'Boxing', icon: '🥊', description: 'Combat sports, training, motivation' },
  { id: 'health', name: 'Health & Wellness', icon: '🏥', description: 'Fitness, nutrition, mental health' },
  { id: 'motivation', name: 'Motivation', icon: '🔥', description: 'Inspirational quotes, success stories' },
  { id: 'fitness', name: 'Fitness', icon: '💪', description: 'Workouts, gym life, strength training' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '✨', description: 'Daily life, travel, personal growth' },
  { id: 'business', name: 'Business', icon: '💼', description: 'Entrepreneurship, productivity, success' },
]

export default function Welcome() {
  const [step, setStep] = useState(1)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    if (!selectedTheme) {
      toast.error('Please select a theme for your account')
      return
    }

    setIsLoading(true)
    try {
      const response = await accountsAPI.create({
        username: data.username,
        password: data.password,
        theme: selectedTheme,
        platform: data.platform || 'instagram'
      })

      if (response.data.success) {
        toast.success('Account created successfully! AI strategy generated.')
        // Store account info for the app
        localStorage.setItem('currentAccount', JSON.stringify({
          id: response.data.account_id,
          username: data.username,
          theme: selectedTheme,
          platform: data.platform || 'instagram'
        }))
        navigate('/app')
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative pt-6 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AutoSocial</h1>
                <p className="text-sm text-gray-500">AI-Powered Automation</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>AI Content Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Smart Automation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Growth Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {step === 1 ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Welcome to the Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> Social Media</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Create, schedule, and manage your Instagram or TikTok content with AI. 
              Generate engaging posts, automate interactions, and grow your audience while you sleep.
            </p>
            
            <div className="mt-10">
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Creation</h3>
                <p className="text-gray-600">Generate captions, hashtags, images, and videos with advanced AI</p>
              </div>
              
              <div className="card text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Automation</h3>
                <p className="text-gray-600">Schedule posts, reply to comments, and engage with your audience automatically</p>
              </div>
              
              <div className="card text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Analytics</h3>
                <p className="text-gray-600">Track performance and optimize your strategy with detailed insights</p>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Choose Your Niche</h2>
              <p className="mt-4 text-lg text-gray-600">
                Select a theme for your AI to create targeted content that resonates with your audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                    selectedTheme === theme.id
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{theme.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => setStep(3)}
                disabled={!selectedTheme}
                className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Account Setup</h2>
              <p className="mt-4 text-lg text-gray-600">
                Enter your social media credentials to start AI automation.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('platform')}
                        value="instagram"
                        defaultChecked
                        className="text-primary-600"
                      />
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('platform')}
                        value="tiktok"
                        className="text-primary-600"
                      />
                      <Play className="h-5 w-5" />
                      <span>TikTok</span>
                    </label>
                  </div>
                </div>

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

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Demo Mode:</strong> Your credentials are encrypted and stored locally. 
                    In production, use proper authentication and security measures.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Start AI Account'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}