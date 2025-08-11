import React from 'react'
import { NavLink } from 'react-router-dom'

function NavTabs() {
  const base = 'px-4 py-2 rounded-t'
  const active = 'bg-white text-blue-600 font-semibold border-t border-l border-r'
  const inactive = 'text-gray-600'

  return (
    <nav className="flex space-x-4 border-b mb-4">
      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        探索
      </NavLink>
      <NavLink
        to="/my-links"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        我的連結
      </NavLink>
    </nav>
  )
}

export default NavTabs
