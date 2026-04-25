import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Missions' },
    { path: '/animals', label: 'Crisis Feed' },
    { path: '/finding-new-beginnings', label: 'Volunteer Hub' },
    { path: '/adoption-form', label: 'Adoptions' },
  ]

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#0d0d0d] border-b border-[#222]">
      <span className="text-[#ff6b2b] font-bold text-lg">Crisis & Compassion</span>
      <div className="flex gap-8">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm transition-colors ${
              location.pathname === link.path
                ? 'text-[#ff6b2b] border-b-2 border-[#ff6b2b]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-600" />
    </nav>
  )
}

export default Navbar