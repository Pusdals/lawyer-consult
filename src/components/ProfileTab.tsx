import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Profile } from '../types'

type ProfileTabProps = {
  profile: Profile
  onChange: (profile: Profile) => void
}

const maxPhotoBytes = 700_000

export function ProfileTab({ profile, onChange }: ProfileTabProps) {
  const [photoError, setPhotoError] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Choose an image file.')
      return
    }
    if (file.size > maxPhotoBytes) {
      setPhotoError('Choose an image under 700 KB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setPhotoError('')
      onChange({ ...profile, avatarDataUrl: reader.result })
    }
    reader.onerror = () => setPhotoError('Could not read that image.')
    reader.readAsDataURL(file)
  }

  function onPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordSaved(false)
    if (!currentPassword || !nextPassword || !confirmPassword) {
      setPasswordError('Fill in every password field.')
      return
    }
    if (nextPassword.length < 8) {
      setPasswordError('Use at least 8 characters for the new password.')
      return
    }
    if (nextPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    setCurrentPassword('')
    setNextPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setPasswordSaved(true)
  }

  return (
    <section className="panel">
      <h1>Profile</h1>
      <div className="avatar-row">
        <label className="avatar">
          {profile.avatarDataUrl ? (
            <img src={profile.avatarDataUrl} alt="Profile photo" />
          ) : (
            <span>Add photo</span>
          )}
          <input
            className="visually-hidden"
            type="file"
            accept="image/*"
            onChange={onPhoto}
          />
        </label>
        <div>
          <p className="consult-place">
            {profile.avatarDataUrl
              ? 'Photo saved on this device.'
              : 'Shown only on this device.'}
          </p>
          {profile.avatarDataUrl && (
            <button
              className="text-button"
              type="button"
              onClick={() => onChange({ ...profile, avatarDataUrl: null })}
            >
              Remove photo
            </button>
          )}
        </div>
      </div>
      {photoError && (
        <p className="form-error" role="alert">
          {photoError}
        </p>
      )}

      <label className="field">
        <span>Name</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={profile.name}
          onChange={(event) =>
            onChange({ ...profile, name: event.target.value })
          }
        />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={profile.email}
          onChange={(event) =>
            onChange({ ...profile, email: event.target.value })
          }
        />
      </label>
      <p className="hint">
        Name and email are saved on this device as you type.
      </p>

      <h2>Password</h2>
      <p className="hint">
        This check stays on this screen. The password is not stored or sent.
      </p>
      <form className="form" noValidate onSubmit={onPassword}>
        <label className="field">
          <span>Current password</span>
          <input
            type="password"
            name="current-password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </label>
        <label className="field">
          <span>New password</span>
          <input
            type="password"
            name="new-password"
            autoComplete="new-password"
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Confirm new password</span>
          <input
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        {passwordError && (
          <p className="form-error" role="alert">
            {passwordError}
          </p>
        )}
        {passwordSaved && (
          <p className="form-success" role="status">
            Password check passed. Nothing was saved.
          </p>
        )}
        <button className="primary" type="submit">
          Change password
        </button>
      </form>
    </section>
  )
}
