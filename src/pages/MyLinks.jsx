import React from 'react'
import Header from '../components/Header.jsx'

function MyLinks() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-screen-sm w-full space-y-6 text-center">
        <Header />
        <p className="text-gray-700">我的連結頁面</p>
      </div>
    </div>
  )
}

export default MyLinks
