import React from 'react'
import Header from '../components/Header.jsx'
import LinkCard from '../components/LinkCard.jsx'

function Explore() {
  const links = [
    {
      title: '示範連結 1',
      description: '範例對話描述',
      tags: ['ChatGPT', '示範'],
      url: 'https://chat.openai.com/share/example-1',
    },
    {
      title: '示範連結 2',
      description: '另外一個對話範例',
      tags: ['AI', '分享'],
      url: 'https://chat.openai.com/share/example-2',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <div className="w-full max-w-screen-md flex flex-col items-center space-y-6">
        <Header />
        <div className="w-full space-y-4">
          {links.length > 0 ? (
            links.map((link) => <LinkCard key={link.url} {...link} />)
          ) : (
            <p className="text-center text-gray-500">Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore
