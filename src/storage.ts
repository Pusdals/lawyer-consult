import { useCallback, useState } from 'react'
import type { AppData, Consultation, Profile } from './types'

export const STORAGE_KEY = 'lawyer-consult.v1'

const emptyProfile: Profile = {
  name: '',
  email: '',
  avatarDataUrl: null,
}

function shiftDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createSeed(): AppData {
  const now = Date.now()
  return {
    consultations: [
      {
        id: crypto.randomUUID(),
        date: shiftDate(3),
        time: '10:30',
        placeKind: 'office',
        placeLabel: 'Office',
        status: 'scheduled',
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        date: shiftDate(-12),
        time: '15:00',
        placeKind: 'online',
        placeLabel: 'Online',
        status: 'completed',
        createdAt: new Date(now - 13 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    messages: [
      {
        id: crypto.randomUUID(),
        author: 'counsel',
        body: 'Hello. This is your first online consultation. Tell me what you would like to cover.',
        createdAt: new Date(now - 20 * 60 * 1000).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        author: 'client',
        body: 'I need a first look at a service contract.',
        createdAt: new Date(now - 18 * 60 * 1000).toISOString(),
      },
    ],
    profile: { ...emptyProfile },
  }
}

function isConsultation(value: unknown): value is Consultation {
  if (!value || typeof value !== 'object') return false
  const item = value as Consultation
  return (
    typeof item.id === 'string' &&
    typeof item.date === 'string' &&
    typeof item.time === 'string' &&
    (item.placeKind === 'office' ||
      item.placeKind === 'online' ||
      item.placeKind === 'custom') &&
    typeof item.placeLabel === 'string' &&
    (item.status === 'scheduled' || item.status === 'completed') &&
    typeof item.createdAt === 'string'
  )
}

function normalize(value: unknown): AppData | null {
  if (!value || typeof value !== 'object') return null
  const data = value as AppData
  if (!Array.isArray(data.consultations) || !Array.isArray(data.messages)) {
    return null
  }
  if (!data.consultations.every(isConsultation)) return null

  const messages = data.messages.filter(
    (message) =>
      message &&
      typeof message.id === 'string' &&
      (message.author === 'client' || message.author === 'counsel') &&
      typeof message.body === 'string' &&
      typeof message.createdAt === 'string',
  )

  const profile = data.profile ?? emptyProfile
  return {
    consultations: data.consultations,
    messages,
    profile: {
      name: typeof profile.name === 'string' ? profile.name : '',
      email: typeof profile.email === 'string' ? profile.email : '',
      avatarDataUrl:
        typeof profile.avatarDataUrl === 'string'
          ? profile.avatarDataUrl
          : null,
    },
  }
}

function writeSeed(): AppData {
  const seed = createSeed()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  } catch {
    // Private mode or a full disk: keep the seed in memory for this visit.
  }
  return seed
}

export function loadAppData(): AppData {
  // CRM: not connected in this demo
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return writeSeed()
    const parsed = normalize(JSON.parse(raw))
    if (!parsed) return writeSeed()
    return parsed
  } catch {
    return writeSeed()
  }
}

export function saveAppData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function createId(): string {
  return crypto.randomUUID()
}

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadAppData())
  const [storageError, setStorageError] = useState('')

  const update = useCallback((next: AppData) => {
    const saved = saveAppData(next)
    setData(next)
    setStorageError(
      saved
        ? ''
        : 'Could not save on this device. This change lasts until you reload.',
    )
  }, [])

  return { data, update, storageError }
}
