import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ChatMessage } from '../types'

type OnlineTabProps = {
  messages: ChatMessage[]
  onSend: (body: string) => void
}

function formatMessageTime(iso: string): string {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function OnlineTab({ messages, onSend }: OnlineTabProps) {
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return
    onSend(body)
    setDraft('')
  }

  return (
    <section className="panel panel-chat">
      <h1>Online</h1>
      <div className="thread" aria-live="polite">
        {messages.length === 0 ? (
          <p className="hint">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <article
              key={message.id}
              className={`bubble bubble-${message.author}`}
            >
              <p className="bubble-author">
                {message.author === 'counsel' ? 'Counsel' : 'You'}
              </p>
              <p className="bubble-body">{message.body}</p>
              <time dateTime={message.createdAt}>
                {formatMessageTime(message.createdAt)}
              </time>
            </article>
          ))
        )}
        <div ref={endRef} />
      </div>
      <form className="composer" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor="chat-draft">
          Message
        </label>
        <input
          id="chat-draft"
          type="text"
          value={draft}
          placeholder="Write a message"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="primary" type="submit" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </section>
  )
}
