import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-screen-sm w-full space-y-6 text-center">
        <Header />
        <p className="text-gray-700">蒐集與分類各種 ChatGPT 對話連結的平台</p>
        <Link
          to="/explore"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          馬上開始探索
        </Link>
      </div>
    </div>
  )
}

export default Home
