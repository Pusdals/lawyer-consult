export type TabId = 'upcoming' | 'book' | 'online' | 'profile'

const tabs: { id: TabId; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'book', label: 'Book' },
  { id: 'online', label: 'Online' },
  { id: 'profile', label: 'Profile' },
]

type BottomNavProps = {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-current={active === tab.id ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <TabIcon id={tab.id} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

function TabIcon({ id }: { id: TabId }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (id === 'upcoming') {
    return (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
      </svg>
    )
  }

  if (id === 'book') {
    return (
      <svg {...common}>
        <path d="M12 5.5v13M5.5 12h13" />
      </svg>
    )
  }

  if (id === 'online') {
    return (
      <svg {...common}>
        <path d="M6 16.5 4.5 19.5V7.5A2 2 0 0 1 6.5 5.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6Z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18.5c1.2-2.2 3.1-3.3 5.5-3.3s4.3 1.1 5.5 3.3" />
    </svg>
  )
}
