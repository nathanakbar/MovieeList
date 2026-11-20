import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3, Heart, Pencil, Star, Trash2 } from 'lucide-react'
import MovieForm from '../components/MovieForm'
import Poster from '../components/Poster'

export default function MovieDetail({ movies, favorites, onToggleFavorite, onDeleteMovie, onUpdateMovie }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = movies.find((item) => item.id === Number(id))
  const [isEditing, setIsEditing] = useState(false)

  if (!movie) {
    return <div className="empty-state detail-missing"><h2>Film tidak ditemukan</h2><button className="button button-primary" onClick={() => navigate('/')}>Kembali ke Home</button></div>
  }

  const isFavorite = favorites.includes(movie.id)

  function handleDelete() {
    if (window.confirm(`Hapus "${movie.title}" dari katalog?`)) {
      onDeleteMovie(movie.id)
      navigate('/')
    }
  }

  return (
    <section className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Kembali</button>
      <div className="detail-layout">
        <div className="detail-poster-wrap"><Poster src={movie.poster} title={movie.title} className="detail-poster" /></div>
        <div className="detail-copy">
          <p className="eyebrow">DETAIL FILM · {movie.genre.toUpperCase()}</p>
          <h1>{movie.title}</h1>
          <div className="detail-meta">
            <span><Star size={16} fill="currentColor" /> {movie.rating}/10</span>
            <span>{movie.year}</span>
            <span><Clock3 size={15} /> {movie.duration || 'Durasi tidak tersedia'}</span>
          </div>
          <p className="detail-description">{movie.description || 'Belum ada sinopsis untuk film ini.'}</p>
          <div className="director-info"><span>Sutradara</span><strong>{movie.director || 'Belum diisi'}</strong></div>
          <div className="detail-actions">
            <button className={`button ${isFavorite ? 'button-favorite' : 'button-primary'}`} onClick={() => onToggleFavorite(movie.id)}>
              <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Hapus Favorit' : 'Tambah Favorit'}
            </button>
            <button className="button button-ghost" onClick={() => setIsEditing(true)}><Pencil size={16} /> Edit</button>
            <button className="button button-danger" onClick={handleDelete}><Trash2 size={16} /> Hapus</button>
          </div>
        </div>
      </div>
      <MovieForm isOpen={isEditing} onClose={() => setIsEditing(false)} onSubmit={(data) => onUpdateMovie({ ...data, id: movie.id })} editingMovie={movie} />
    </section>
  )
}