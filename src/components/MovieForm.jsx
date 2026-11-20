import { useEffect, useRef, useState } from 'react'
import { X, Upload, Image as ImageIcon, Link2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'
import PropTypes from 'prop-types'
import { genres } from '../data/movies'

const emptyForm = {
  title: '', year: new Date().getFullYear(), genre: 'Action', rating: 7,
  duration: '1j 30m', director: '', description: '', poster: '',
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_IMAGE_WIDTH = 700
const MAX_IMAGE_HEIGHT = 1050

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('File gambar tidak dapat dibaca.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('File bukan gambar yang valid.'))
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_WIDTH / image.width, MAX_IMAGE_HEIGHT / image.height)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Browser tidak mendukung pemrosesan gambar.'))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.82)
        resolve(compressed)
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function isValidWebUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export default function MovieForm({ isOpen, onClose, onSubmit, editingMovie }) {
  const [form, setForm] = useState(emptyForm)
  const [posterUrl, setPosterUrl] = useState('')
  const [posterStatus, setPosterStatus] = useState('empty')
  const [posterMessage, setPosterMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const movie = editingMovie ? { ...emptyForm, ...editingMovie } : emptyForm
    const existingPoster = movie.poster || ''
    const isUploadedImage = existingPoster.startsWith('data:image/')
    setForm(movie)
    setPosterUrl(isUploadedImage ? '' : existingPoster)
    setPosterStatus(existingPoster ? 'checking' : 'empty')
    setPosterMessage('')
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [editingMovie, isOpen])

  if (!isOpen) return null

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: name === 'year' || name === 'rating' ? Number(value) : value }))
  }

  function handlePosterUrlChange(event) {
    const value = event.target.value.trim()
    setPosterUrl(value)
    setForm((current) => ({ ...current, poster: value }))
    setPosterStatus(value ? (isValidWebUrl(value) ? 'checking' : 'error') : 'empty')
    setPosterMessage(value && !isValidWebUrl(value) ? 'Masukkan URL gambar yang diawali http:// atau https://.' : '')
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPosterStatus('error')
      setPosterMessage('File yang dipilih bukan gambar. Gunakan JPG, PNG, atau WEBP.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPosterStatus('error')
      setPosterMessage('Ukuran gambar terlalu besar. Maksimal ukuran file adalah 10 MB.')
      event.target.value = ''
      return
    }

    setIsUploading(true)
    setPosterMessage('Sedang memproses dan mengecilkan ukuran gambar...')
    try {
      const dataUrl = await compressImage(file)
      setForm((current) => ({ ...current, poster: dataUrl }))
      setPosterUrl('')
      setPosterStatus('loaded')
      setPosterMessage('Poster berhasil dipilih dan disiapkan.')
    } catch (error) {
      setPosterStatus('error')
      setPosterMessage(error.message || 'Poster gagal diproses. Coba file gambar lain.')
    } finally {
      setIsUploading(false)
    }
  }

  function clearPoster() {
    setForm((current) => ({ ...current, poster: '' }))
    setPosterUrl('')
    setPosterStatus('empty')
    setPosterMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(event) {
    event.preventDefault()
    const finalPoster = posterUrl || (form.poster.startsWith('data:image/') ? form.poster : '')

    if (posterUrl && !isValidWebUrl(posterUrl)) {
      setPosterStatus('error')
      setPosterMessage('URL poster tidak valid. Gunakan alamat gambar yang diawali http:// atau https://.')
      return
    }
    if (finalPoster && posterStatus === 'error') {
      setPosterMessage((current) => current || 'Poster tidak dapat dimuat. Ganti URL atau unggah gambar dari perangkat.')
      return
    }
    if (finalPoster && posterStatus !== 'loaded') {
      setPosterMessage('Tunggu sampai preview poster selesai diperiksa sebelum menyimpan.')
      return
    }

    onSubmit({ ...form, poster: finalPoster })
    onClose()
  }

  const previewSrc = posterUrl || (form.poster.startsWith('data:image/') ? form.poster : '')

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-panel">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">KOLEKSI FILM</p>
            <h2>{editingMovie ? 'Edit Film' : 'Tambah Film Baru'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Tutup"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="movie-form">
          <label>Judul film<input name="title" value={form.title} onChange={handleChange} required maxLength="70" placeholder="Contoh: Dune" /></label>
          <div className="form-row">
            <label>Tahun rilis<input name="year" type="number" min="1888" max="2100" value={form.year} onChange={handleChange} required /></label>
            <label>Rating (0–10)<input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={handleChange} required /></label>
          </div>
          <div className="form-row">
            <label>Genre
              <select name="genre" value={form.genre} onChange={handleChange}>
                {genres.filter((genre) => genre !== 'All').map((genre) => <option key={genre}>{genre}</option>)}
              </select>
            </label>
            <label>Durasi<input name="duration" value={form.duration} onChange={handleChange} placeholder="2j 10m" /></label>
          </div>
          <label>Sutradara<input name="director" value={form.director} onChange={handleChange} placeholder="Nama sutradara" /></label>

          <div className="poster-editor">
            <div className="poster-editor-heading">
              <label htmlFor="poster-url">Poster film</label>
              <span>Opsional</span>
            </div>
            <div className="poster-url-field">
              <Link2 size={17} />
              <input id="poster-url" type="url" value={posterUrl} onChange={handlePosterUrlChange} placeholder="Tempel URL gambar: https://..." />
            </div>
            <div className="poster-or-divider"><span>atau unggah dari perangkat</span></div>
            <label className="poster-upload-button">
              <Upload size={17} />
              {isUploading ? 'Memproses gambar...' : 'Pilih gambar dari komputer'}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} disabled={isUploading} />
            </label>
            <p className="poster-help">Format JPG, PNG, WEBP, atau GIF. Maksimal 10 MB. Gambar akan diperkecil agar lebih hemat penyimpanan.</p>

            {previewSrc && (
              <div className="poster-preview-card">
                <div className="poster-preview-image-wrap">
                  <img
                    key={previewSrc}
                    src={previewSrc}
                    alt="Preview poster film"
                    onLoad={() => { setPosterStatus('loaded'); setPosterMessage('Poster berhasil dimuat.') }}
                    onError={() => { setPosterStatus('error'); setPosterMessage('Gambar gagal dimuat. Coba URL lain atau unggah gambar dari perangkat.') }}
                  />
                </div>
                <div className="poster-preview-info">
                  <strong>Preview poster</strong>
                  <span>{posterStatus === 'loaded' ? 'Gambar siap digunakan' : posterStatus === 'error' ? 'Gambar tidak dapat dimuat' : 'Memeriksa gambar...'}</span>
                  <button type="button" className="poster-remove-button" onClick={clearPoster}><Trash2 size={14} /> Hapus poster</button>
                </div>
              </div>
            )}
            {!previewSrc && (
              <div className="poster-empty-preview"><ImageIcon size={24} /><span>Preview poster akan muncul di sini</span></div>
            )}
            {posterMessage && (
              <p className={`poster-feedback ${posterStatus === 'error' ? 'is-error' : posterStatus === 'loaded' ? 'is-success' : ''}`}>
                {posterStatus === 'error' ? <AlertCircle size={15} /> : posterStatus === 'loaded' ? <CheckCircle2 size={15} /> : <ImageIcon size={15} />}
                {posterMessage}
              </p>
            )}
          </div>

          <label>Sinopsis<textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Ceritakan singkat film..." /></label>
          <div className="modal-actions">
            <button type="button" className="button button-ghost" onClick={onClose}>Batal</button>
            <button type="submit" className="button button-primary" disabled={isUploading || (Boolean(previewSrc) && posterStatus !== 'loaded')}>
              {editingMovie ? 'Simpan Perubahan' : 'Tambah Film'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

MovieForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingMovie: PropTypes.object,
}
