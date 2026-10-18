import type { Consultation } from '../types'

type UpcomingTabProps = {
  consultations: Consultation[]
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function formatTime(isoDate: string, time: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(year, month - 1, day, hour, minute))
}

function bySchedule(a: Consultation, b: Consultation): number {
  if (a.status !== b.status) return a.status === 'scheduled' ? -1 : 1
  return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
}

export function UpcomingTab({ consultations }: UpcomingTabProps) {
  const items = [...consultations].sort(bySchedule)

  return (
    <section className="panel">
      <h1>Upcoming</h1>
      {items.length === 0 ? (
        <div className="card">
          <p>No consultations yet. Use Book to add one.</p>
        </div>
      ) : (
        <ul className="consult-list">
          {items.map((item) => (
            <li key={item.id} className="card consult-card">
              <div>
                <p className="consult-when">
                  {formatDate(item.date)} · {formatTime(item.date, item.time)}
                </p>
                <p className="consult-place">{item.placeLabel}</p>
              </div>
              <span className={`badge badge-${item.status}`}>
                {item.status === 'scheduled' ? 'Scheduled' : 'Completed'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
