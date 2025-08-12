import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-screen-sm w-full space-y-6 text-center">
        <Header />
        <p className="text-gray-700">蒐集與分類各種 ChatGPT 對話連結的平台</p>
        <ul className="mt-4 text-gray-700 text-left list-disc list-inside space-y-1">
          <li>把對話變成可搜索的知識卡</li>
          <li>收藏 ChatGPT 對話連結</li>
          <li>用標籤整理與再搜尋</li>
          <li>一鍵預覽與二次分享</li>
        </ul>
        <Link to="/my-links" className="btn">我的連結</Link>
      </div>
    </div>
  )
}

export default Home
