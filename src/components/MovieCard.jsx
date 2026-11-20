import { Heart, Star, CalendarDays } from 'lucide-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Poster from './Poster'

export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="poster-link" aria-label={`Lihat detail ${movie.title}`}>
        <Poster className="movie-poster" src={movie.poster} title={movie.title} />
        <span className="poster-rating"><Star size={13} fill="currentColor" /> {movie.rating}</span>
      </Link>
      <button
        className={`favorite-button ${isFavorite ? 'selected' : ''}`}
        onClick={() => onToggleFavorite(movie.id)}
        aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
      <div className="movie-info">
        <Link to={`/movie/${movie.id}`} className="movie-title">{movie.title}</Link>
        <div className="movie-meta">
          <span><CalendarDays size={13} /> {movie.year}</span>
          <span className="genre-pill">{movie.genre}</span>
        </div>
      </div>
    </article>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    genre: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    poster: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
}