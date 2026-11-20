import { Clapperboard } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <Clapperboard size={17} />
      <span>MovieList</span>
      <span className="footer-muted">Katalog film sederhana.</span>
    </footer>
  )
}