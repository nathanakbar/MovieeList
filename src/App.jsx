import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import MovieDetail from './pages/MovieDetail'
import NotFound from './pages/NotFound'
import Account from './pages/Account'
import { initialMovies } from './data/movies'

const MOVIES_KEY = 'movielist.movies.v2'
const FAVORITES_KEY = 'movielist.favorites.v2'
const FAVORITES_BY_USER_KEY = 'movielist.favorites.by-user.v1'
const USERS_KEY = 'movielist.users.v1'
const SESSION_KEY = 'movielist.session.v1'

function loadStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Abaikan jika storage tidak tersedia atau kapasitasnya penuh.
  }
}

async function hashPassword(password, saltHex) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Fitur keamanan browser tidak tersedia. Jalankan aplikasi melalui localhost atau HTTPS.')
  }
  const encoder = new TextEncoder()
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)))
    : globalThis.crypto.getRandomValues(new Uint8Array(16))
  const key = await globalThis.crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await globalThis.crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256)
  const hash = Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
  const saltValue = saltHex || Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return { hash, salt: saltValue }
}

export default function App() {
  const [movies, setMovies] = useState(() => loadStored(MOVIES_KEY, initialMovies))
  const [users, setUsers] = useState(() => loadStored(USERS_KEY, []))
  const [activeUserId, setActiveUserId] = useState(() => loadStored(SESSION_KEY, null))
  const [favoriteLists, setFavoriteLists] = useState(() => {
    const savedLists = loadStored(FAVORITES_BY_USER_KEY, null)
    if (savedLists) return savedLists
    return { guest: loadStored(FAVORITES_KEY, []) }
  })

  const currentUser = useMemo(() => users.find((user) => user.id === activeUserId) || null, [users, activeUserId])
  const favoriteOwner = currentUser?.id || 'guest'
  const favorites = favoriteLists[favoriteOwner] || []

  useEffect(() => saveStored(MOVIES_KEY, movies), [movies])
  useEffect(() => saveStored(USERS_KEY, users), [users])
  useEffect(() => saveStored(FAVORITES_BY_USER_KEY, favoriteLists), [favoriteLists])
  useEffect(() => saveStored(SESSION_KEY, activeUserId), [activeUserId])

  function toggleFavorite(id) {
    setFavoriteLists((current) => {
      const activeFavorites = current[favoriteOwner] || []
      const nextFavorites = activeFavorites.includes(id)
        ? activeFavorites.filter((item) => item !== id)
        : [...activeFavorites, id]
      return { ...current, [favoriteOwner]: nextFavorites }
    })
  }

  function addMovie(movieData) {
    setMovies((current) => {
      const nextId = current.reduce((max, movie) => Math.max(max, movie.id), 0) + 1
      return [...current, { ...movieData, id: nextId }]
    })
  }

  function updateMovie(updated) {
    setMovies((current) => current.map((movie) => (movie.id === updated.id ? updated : movie)))
  }

  function deleteMovie(id) {
    setMovies((current) => current.filter((movie) => movie.id !== id))
    setFavoriteLists((current) => Object.fromEntries(
      Object.entries(current).map(([owner, ids]) => [owner, ids.filter((item) => item !== id)]),
    ))
  }

  async function registerUser({ name, email, password, avatar }) {
    const normalizedEmail = email.toLowerCase()
    if (users.some((user) => user.email === normalizedEmail)) {
      return { error: 'Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.' }
    }
    try {
      const { hash, salt } = await hashPassword(password)
      const newUser = {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        email: normalizedEmail,
        avatar,
        bio: '',
        createdAt: new Date().toISOString(),
        passwordHash: hash,
        passwordSalt: salt,
      }
      setUsers((current) => [...current, newUser])
      setActiveUserId(newUser.id)
      setFavoriteLists((current) => ({ ...current, [newUser.id]: current.guest || [] }))
      return { ok: true }
    } catch (error) {
      return { error: error.message || 'Akun belum dapat dibuat. Coba lagi.' }
    }
  }

  async function loginUser({ email, password }) {
    const normalizedEmail = email.toLowerCase()
    const foundUser = users.find((user) => user.email === normalizedEmail)
    if (!foundUser) return { error: 'Email belum terdaftar.' }
    try {
      const { hash } = await hashPassword(password, foundUser.passwordSalt)
      if (hash !== foundUser.passwordHash) return { error: 'Password yang kamu masukkan salah.' }
      setActiveUserId(foundUser.id)
      return { ok: true }
    } catch (error) {
      return { error: error.message || 'Tidak dapat masuk. Coba lagi.' }
    }
  }

  function updateProfile(changes) {
    if (!currentUser) return
    setUsers((current) => current.map((user) => user.id === currentUser.id ? { ...user, ...changes } : user))
  }

  function logoutUser() {
    setActiveUserId(null)
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar favoriteCount={favorites.length} currentUser={currentUser} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <Home movies={movies} favorites={favorites} onToggleFavorite={toggleFavorite}
                onAddMovie={addMovie} onUpdateMovie={updateMovie} onDeleteMovie={deleteMovie} />
            } />
            <Route path="/favorites" element={<Favorites movies={movies} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/movie/:id" element={
              <MovieDetail movies={movies} favorites={favorites} onToggleFavorite={toggleFavorite}
                onDeleteMovie={deleteMovie} onUpdateMovie={updateMovie} />
            } />
            <Route path="/account" element={
              <Account user={currentUser} onRegister={registerUser} onLogin={loginUser}
                onUpdateProfile={updateProfile} onLogout={logoutUser} favoriteCount={favorites.length} />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
