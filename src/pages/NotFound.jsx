import { Link } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="empty-state not-found">
      <Clapperboard size={42} />
      <p className="eyebrow">404 — HALAMAN TIDAK DITEMUKAN</p>
      <h1>Sepertinya filmnya belum tayang.</h1>
      <p>Alamat yang kamu buka tidak tersedia.</p>
      <Link to="/" className="button button-primary">Kembali ke Home</Link>
    </div>
  )
}