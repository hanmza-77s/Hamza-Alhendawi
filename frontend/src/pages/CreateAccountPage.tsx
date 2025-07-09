import React from 'react'
import WelcomeScreen from '../components/WelcomeScreen'

const CreateAccountPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create Another Account</h2>
      <WelcomeScreen />
    </div>
  )
}

export default CreateAccountPage