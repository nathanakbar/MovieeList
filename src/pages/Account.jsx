import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Clapperboard, LogIn, LogOut, Save, ShieldCheck, UserRound, UserPlus } from 'lucide-react'

const AVATARS = ['🎬', '🍿', '🎥', '🌟', '🎭', '🦊', '🐼', '🚀']

export default function Account({ user, onRegister, onLogin, onUpdateProfile, onLogout, favoriteCount }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', avatar: '🎬', bio: '' })

  function changeField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setMessage('Konfirmasi password tidak sama.')
      return
    }
    if (mode === 'register' && form.password.length < 8) {
      setMessage('Password minimal 8 karakter.')
      return
    }

    setIsLoading(true)
    const result = mode === 'register'
      ? await onRegister({ name: form.name.trim(), email: form.email.trim(), password: form.password, avatar: form.avatar })
      : await onLogin({ email: form.email.trim(), password: form.password })
    setIsLoading(false)

    if (result?.error) setMessage(result.error)
    else navigate('/account')
  }

  function startEditing() {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      avatar: user.avatar || '🎬',
      bio: user.bio || '',
    })
    setIsEditing(true)
    setMessage('')
  }

  function saveProfile(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      setMessage('Nama tidak boleh kosong.')
      return
    }
    onUpdateProfile({ name: form.name.trim(), avatar: form.avatar, bio: form.bio.trim() })
    setIsEditing(false)
    setMessage('Profil berhasil diperbarui.')
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setMessage('')
    setForm({ name: '', email: '', password: '', confirmPassword: '', avatar: '🎬', bio: '' })
  }

  if (user) {
    return (
      <section className="account-page">
        <div className="account-heading">
          <p className="eyebrow"><UserRound size={14} /> AKUN MOVIELIST</p>
          <h1>Profil Saya</h1>
          <p className="page-subtitle">Kelola informasi profil dan lihat aktivitas film kamu.</p>
        </div>

        <div className="profile-card">
          <div className="profile-cover"><span>YOUR PERSONAL MOVIE SPACE</span><Clapperboard size={42} /></div>
          <div className="profile-main">
            <div className="profile-avatar">{user.avatar || '🎬'}</div>
            <div className="profile-identity">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span className="profile-badge"><ShieldCheck size={14} /> Anggota MovieList</span>
            </div>
            <button className="button button-primary profile-edit-button" onClick={startEditing}><Camera size={16} /> Edit Profil</button>
          </div>
          <div className="profile-details">
            <div className="profile-stat"><strong>{favoriteCount}</strong><span>Film Favorit</span></div>
            <div className="profile-stat"><strong>{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong><span>Bergabung Sejak</span></div>
          </div>
          <div className="profile-bio">
            <h3>Tentang Saya</h3>
            <p>{user.bio || 'Belum ada bio. Ceritakan sedikit tentang dirimu dan film yang kamu sukai.'}</p>
          </div>
          {message && <p className="form-message success-message">{message}</p>}
          <div className="profile-footer">
            <button className="button button-ghost" onClick={() => navigate('/')} >Jelajahi Film</button>
            <button className="button button-danger" onClick={() => { onLogout(); navigate('/') }}><LogOut size={16} /> Keluar</button>
          </div>
        </div>

        {isEditing && (
          <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
            <div className="modal-panel account-modal" onClick={(event) => event.stopPropagation()}>
              <div className="modal-heading"><div><p className="eyebrow">PENGATURAN AKUN</p><h2>Edit Profil</h2></div><button className="icon-button" onClick={() => setIsEditing(false)} aria-label="Tutup">×</button></div>
              <form className="movie-form" onSubmit={saveProfile}>
                <label>Nama tampilan<input name="name" value={form.name} onChange={changeField} required maxLength={40} /></label>
                <label>Email<input value={user.email} disabled /></label>
                <label>Avatar
                  <div className="avatar-picker">{AVATARS.map((avatar) => <button type="button" key={avatar} className={`avatar-choice ${form.avatar === avatar ? 'selected' : ''}`} onClick={() => setForm((current) => ({ ...current, avatar }))}>{avatar}</button>)}</div>
                </label>
                <label>Bio<textarea name="bio" value={form.bio} onChange={changeField} rows="3" maxLength={180} placeholder="Ceritakan sedikit tentang dirimu..." /></label>
                {message && <p className="form-message error-message">{message}</p>}
                <div className="modal-actions"><button type="button" className="button button-ghost" onClick={() => setIsEditing(false)}>Batal</button><button className="button button-primary" type="submit"><Save size={16} /> Simpan Perubahan</button></div>
              </form>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="account-page auth-page">
      <div className="auth-card">
        <div className="auth-brand"><span className="brand-icon"><Clapperboard size={24} /></span><span>Movie<span className="brand-accent">List</span></span></div>
        <p className="eyebrow">AKUN MOVIELIST</p>
        <h1>{mode === 'login' ? 'Selamat datang kembali!' : 'Buat akun baru'}</h1>
        <p className="page-subtitle">{mode === 'login' ? 'Masuk untuk membuka profil dan menyimpan daftar favoritmu.' : 'Buat profil pribadi untuk mulai mengelola koleksi film favoritmu.'}</p>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}><LogIn size={16} /> Masuk</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}><UserPlus size={16} /> Daftar</button>
        </div>

        <form className="movie-form auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && <>
            <label>Nama lengkap<input name="name" value={form.name} onChange={changeField} placeholder="Contoh: Budi Santoso" required maxLength={40} /></label>
            <label>Pilih avatar
              <div className="avatar-picker">{AVATARS.map((avatar) => <button type="button" key={avatar} className={`avatar-choice ${form.avatar === avatar ? 'selected' : ''}`} onClick={() => setForm((current) => ({ ...current, avatar }))}>{avatar}</button>)}</div>
            </label>
          </>}
          <label>Email<input type="email" name="email" value={form.email} onChange={changeField} placeholder="nama@email.com" autoComplete="email" required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={changeField} placeholder={mode === 'register' ? 'Minimal 8 karakter' : 'Masukkan password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required /></label>
          {mode === 'register' && <label>Konfirmasi password<input type="password" name="confirmPassword" value={form.confirmPassword} onChange={changeField} placeholder="Ulangi password" autoComplete="new-password" required /></label>}
          {message && <p className="form-message error-message">{message}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Memproses...' : mode === 'login' ? <><LogIn size={17} /> Masuk ke Akun</> : <><UserPlus size={17} /> Buat Akun</>}</button>
        </form>
        <p className="auth-note"><ShieldCheck size={14} /> Akun demo disimpan di browser/perangkat ini.</p>
      </div>
    </section>
  )
}
