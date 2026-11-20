import { useState } from 'react'
import PropTypes from 'prop-types'

// Poster pengganti (SVG) kalau URL poster kosong atau gagal dimuat
function fallbackPoster(title) {
  const safe = String(title).replace(/[<>&"']/g, '').slice(0, 40)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12332e"/><stop offset="1" stop-color="#07100e"/></linearGradient></defs>
    <rect width="300" height="450" fill="url(#g)"/>
    <text x="150" y="215" font-family="Arial,sans-serif" font-size="64" text-anchor="middle" fill="#2dd4bf">🎬</text>
    <text x="150" y="275" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#e7f1ee">${safe}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export default function Poster({ src, title, className }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const useFallback = !src || failedSrc === src
  return (
    <img
      className={className}
      src={useFallback ? fallbackPoster(title) : src}
      alt={`Poster ${title}`}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  )
}

Poster.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
}
