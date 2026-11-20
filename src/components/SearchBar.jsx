import { Search, X } from 'lucide-react'
import PropTypes from 'prop-types'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-box">
      <Search size={19} />
      <input
        type="search"
        placeholder="Cari judul film..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Cari judul film"
      />
      {value && (
        <button className="clear-search" onClick={() => onChange('')} aria-label="Hapus pencarian">
          <X size={17} />
        </button>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}