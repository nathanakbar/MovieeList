import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'

export default function Favorites({ movies, favorites, onToggleFavorite }) {
  const favoriteMovies = movies.filter((movie) => favorites.includes(movie.id))

  return (
    <section className="catalog-section favorites-page">
      <div className="section-heading">
        <div><p className="eyebrow"><Heart size={13} /> KOLEKSI PRIBADI</p><h1>Film Favorit</h1><p className="page-subtitle">Semua film yang kamu simpan ada di sini.</p></div>
        <span className="favorite-total">{favoriteMovies.length} film</span>
      </div>
      {favoriteMovies.length > 0 ? (
        <div className="movie-grid">
          {favoriteMovies.map((movie) => <MovieCard key={movie.id} movie={movie} isFavorite onToggleFavorite={onToggleFavorite} />)}
        </div>
      ) : (
        <div className="empty-state"><Heart size={34} /><h3>Belum ada film favorit</h3><p>Tekan ikon hati pada kartu film untuk menyimpannya.</p><Link to="/" className="button button-primary">Jelajahi Film</Link></div>
      )}
    </section>
  )
}