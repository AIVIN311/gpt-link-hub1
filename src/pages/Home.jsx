import React from 'react'
import Header from '../components/Header.jsx'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="max-w-screen-sm w-full text-center space-y-4">
          <h1 className="text-3xl font-bold">GPT Link Hub</h1>
          <p className="text-gray-700">蒐集與分類各種 ChatGPT 對話連結的平台</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">馬上開始探索</button>
        </div>
      </main>
    </div>
  )
}

export default Home
