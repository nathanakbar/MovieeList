import { useMemo, useState } from 'react'
import { Film, Plus, SlidersHorizontal } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import MovieForm from '../components/MovieForm'
import { genres } from '../data/movies'

export default function Home({ movies, favorites, onToggleFavorite, onAddMovie, onUpdateMovie, onDeleteMovie }) {
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)

  const filteredMovies = useMemo(() => movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre
    return matchesSearch && matchesGenre
  }), [movies, search, selectedGenre])

  function openAddForm() {
    setEditingMovie(null)
    setIsFormOpen(true)
  }

  function openEditForm(movie) {
    setEditingMovie(movie)
    setIsFormOpen(true)
  }

  function handleFormSubmit(movieData) {
    if (editingMovie) onUpdateMovie({ ...movieData, id: editingMovie.id })
    else onAddMovie(movieData)
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow"><Film size={14} /> YOUR PERSONAL MOVIE LIBRARY</p>
          <h1>Temukan film untuk<br /><span>cerita berikutnya.</span></h1>
          <p className="hero-description">Jelajahi koleksi film, temukan tontonan menarik, dan simpan pilihan favoritmu.</p>
          <div className="hero-stats">
            <div><strong>{movies.length}</strong><span>Total Film</span></div>
            <div><strong>{favorites.length}</strong><span>Favorit</span></div>
            <div><strong>{genres.length - 1}</strong><span>Kategori</span></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-ticket"><Film size={86} strokeWidth={1} /></div>
          <span className="hero-spark spark-one">✦</span><span className="hero-spark spark-two">✧</span>
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div><p className="eyebrow">PILIHAN UNTUKMU</p><h2>Jelajahi Film</h2></div>
          <button className="button button-primary" onClick={openAddForm}><Plus size={17} /> Tambah Film</button>
        </div>

        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <div className="filter-label"><SlidersHorizontal size={16} /> Genre</div>
          <div className="genre-filters">
            {genres.map((genre) => (
              <button key={genre} onClick={() => setSelectedGenre(genre)} className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}>{genre}</button>
            ))}
          </div>
        </div>

        <div className="results-line"><span>{filteredMovies.length} film ditemukan</span><span>Urutan: ranking IMDb</span></div>
        {filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div className="movie-card-wrap" key={movie.id}>
                <MovieCard movie={movie} isFavorite={favorites.includes(movie.id)} onToggleFavorite={onToggleFavorite} />
                <div className="card-admin-actions">
                  <button onClick={() => openEditForm(movie)}>Edit</button>
                  <button onClick={() => {
                    if (window.confirm(`Hapus "${movie.title}" dari katalog?`)) onDeleteMovie(movie.id)
                  }}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><Film size={34} /><h3>Film tidak ditemukan</h3><p>Coba kata kunci atau kategori yang berbeda.</p><button className="button button-ghost" onClick={() => { setSearch(''); setSelectedGenre('All') }}>Reset pencarian</button></div>
        )}
      </section>

      <MovieForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} editingMovie={editingMovie} />
    </>
  )
}