import { useState } from 'react'
import type { FormEvent } from 'react'
import type { PlaceKind } from '../types'

type BookTabProps = {
  onCreate: (draft: {
    date: string
    time: string
    placeKind: PlaceKind
    placeLabel: string
  }) => void
}

const places: { kind: PlaceKind; label: string }[] = [
  { kind: 'office', label: 'Office' },
  { kind: 'online', label: 'Online' },
  { kind: 'custom', label: 'Custom' },
]

export function BookTab({ onCreate }: BookTabProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [placeKind, setPlaceKind] = useState<PlaceKind>('office')
  const [customPlace, setCustomPlace] = useState('')
  const [error, setError] = useState('')

  function placeLabelFor(kind: PlaceKind, custom: string): string {
    if (kind === 'custom') return custom.trim()
    if (kind === 'office') return 'Office'
    return 'Online'
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const placeLabel = placeLabelFor(placeKind, customPlace)

    if (!date) {
      setError('Choose a date.')
      return
    }
    if (!time) {
      setError('Choose a time.')
      return
    }
    if (!placeLabel) {
      setError('Enter a place.')
      return
    }

    onCreate({ date, time, placeKind, placeLabel })
  }

  return (
    <section className="panel">
      <h1>Book</h1>
      <form className="form" noValidate onSubmit={onSubmit}>
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              setError('')
            }}
          />
        </label>
        <label className="field">
          <span>Time</span>
          <input
            type="time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value)
              setError('')
            }}
          />
        </label>
        <fieldset className="field">
          <legend>Place</legend>
          <div className="segment">
            {places.map((place) => (
              <button
                key={place.kind}
                type="button"
                aria-pressed={placeKind === place.kind}
                onClick={() => {
                  setPlaceKind(place.kind)
                  setError('')
                }}
              >
                {place.label}
              </button>
            ))}
          </div>
        </fieldset>
        {placeKind === 'custom' && (
          <label className="field">
            <span>Custom place</span>
            <input
              type="text"
              value={customPlace}
              maxLength={80}
              placeholder="Courthouse, room 4"
              onChange={(event) => {
                setCustomPlace(event.target.value)
                setError('')
              }}
            />
          </label>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" type="submit">
          Save consultation
        </button>
      </form>
    </section>
  )
}
