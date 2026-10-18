export type PlaceKind = 'office' | 'online' | 'custom'
export type ConsultStatus = 'scheduled' | 'completed'
export type Author = 'client' | 'counsel'

export type Consultation = {
  id: string
  date: string
  time: string
  placeKind: PlaceKind
  placeLabel: string
  status: ConsultStatus
  createdAt: string
}

export type ChatMessage = {
  id: string
  author: Author
  body: string
  createdAt: string
}

export type Profile = {
  name: string
  email: string
  avatarDataUrl: string | null
}

export type AppData = {
  consultations: Consultation[]
  messages: ChatMessage[]
  profile: Profile
}
