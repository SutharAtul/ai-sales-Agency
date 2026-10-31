import { useState, useCallback } from 'react'

/**
 * Simple toast notification hook.
 * Returns the current message and a `notify` function.
 */
export function useToast(durationMs = 2600) {
  const [message, setMessage] = useState('')

  const notify = useCallback(
    (text: string) => {
      setMessage(text)
      window.setTimeout(() => setMessage(''), durationMs)
    },
    [durationMs],
  )

  const dismiss = useCallback(() => setMessage(''), [])

  return { message, notify, dismiss } as const
}

