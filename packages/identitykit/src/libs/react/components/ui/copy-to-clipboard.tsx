import React, { useState } from "react"

export function CopyToClipboard({
  component: Component,
  onCopied,
  onCopiedTimeout,
  value,
}: {
  component: React.ComponentType<{ onClick: () => unknown }>
  onCopied?: () => unknown
  onCopiedTimeout?: () => unknown
  value: string
}) {
  const [clicked, setClicked] = useState(false)
  return (
    <Component
      onClick={() => {
        if (clicked) return
        setClicked(true)
        setTimeout(() => {
          setClicked(false)
          onCopiedTimeout?.()
        }, 1000)
        navigator.clipboard.writeText(value)
        onCopied?.()
      }}
    />
  )
}
