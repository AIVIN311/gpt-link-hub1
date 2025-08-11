import React from 'react'
import { NavLink } from 'react-router-dom'

function Header() {
  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`

  return (
    <nav className="sticky top-0 bg-white flex justify-center gap-4">
      <NavLink to="/explore" className={tabClass}>
        Explore
      </NavLink>
      <NavLink to="/" end className={tabClass}>
        My Links
      </NavLink>
    </nav>
  )
}

export default Header
