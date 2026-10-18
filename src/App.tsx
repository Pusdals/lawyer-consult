import { useState } from 'react'
import { BookTab } from './components/BookTab'
import { BottomNav } from './components/BottomNav'
import type { TabId } from './components/BottomNav'
import { OnlineTab } from './components/OnlineTab'
import { ProfileTab } from './components/ProfileTab'
import { UpcomingTab } from './components/UpcomingTab'
import { createId, useAppData } from './storage'

function App() {
  const [tab, setTab] = useState<TabId>('upcoming')
  const { data, update, storageError } = useAppData()

  return (
    <div className="app">
      <header className="topbar">
        <p className="brand">Consultation</p>
        {storageError && (
          <p className="form-error" role="alert">
            {storageError}
          </p>
        )}
      </header>
      <main className={tab === 'online' ? 'screen screen-chat' : 'screen'}>
        {tab === 'upcoming' && (
          <UpcomingTab consultations={data.consultations} />
        )}
        {tab === 'book' && (
          <BookTab
            onCreate={(draft) => {
              update({
                ...data,
                consultations: [
                  ...data.consultations,
                  {
                    ...draft,
                    id: createId(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                  },
                ],
              })
              setTab('upcoming')
            }}
          />
        )}
        {tab === 'online' && (
          <OnlineTab
            messages={data.messages}
            onSend={(body) => {
              update({
                ...data,
                messages: [
                  ...data.messages,
                  {
                    id: createId(),
                    author: 'client',
                    body,
                    createdAt: new Date().toISOString(),
                  },
                ],
              })
            }}
          />
        )}
        {tab === 'profile' && (
          <ProfileTab
            profile={data.profile}
            onChange={(profile) => update({ ...data, profile })}
          />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
