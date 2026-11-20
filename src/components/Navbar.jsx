import { Clapperboard, Heart, House, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function Navbar({ favoriteCount, currentUser }) {
  return (
    <header className="topbar">
      <div className="nav-inner">
        <NavLink to="/" className="brand">
          <span className="brand-icon"><Clapperboard size={21} /></span>
          <span>Movie<span className="brand-accent">List</span></span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <House size={17} /> Home
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Heart size={17} /> Favorite
            <span className="nav-count">{favoriteCount}</span>
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => isActive ? 'nav-link active account-nav-link' : 'nav-link account-nav-link'}>
            {currentUser ? <span className="nav-avatar">{currentUser.avatar || '🎬'}</span> : <UserRound size={17} />}
            {currentUser ? currentUser.name.split(' ')[0] : 'Akun'}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  favoriteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
}

Navbar.defaultProps = {
  currentUser: null,
}
