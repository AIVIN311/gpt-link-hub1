import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-screen-sm w-full space-y-6 text-center">
        <Header />
        <p className="text-gray-700">蒐集與分類各種 ChatGPT 對話連結的平台</p>
        <div className="mt-4">
          <Link
            to="/explore"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            馬上開始探索
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
