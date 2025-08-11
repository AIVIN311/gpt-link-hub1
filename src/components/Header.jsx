import React from 'react'
import { NavLink } from 'react-router-dom'

function Header() {
  const tabClass = ({ isActive }) =>
    `px-4 py-3 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur">
      <nav className="flex gap-4 overflow-x-auto whitespace-nowrap px-4">
        <NavLink to="/explore" className={tabClass}>
          Explore
        </NavLink>
        <NavLink to="/" end className={tabClass}>
          My Links
        </NavLink>
      </nav>
    </header>
  )
}

export default Header

