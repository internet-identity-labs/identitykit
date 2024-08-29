import { useState } from "react"

export function useLogoutOnIdle() {
  const [idle, setIdle] = useState(false)

  return {
    logoutByIdle: () => {
      setIdle(true)
      setTimeout(() => setIdle(false), 2000)
    },
    shouldLogoutByIdle: idle,
  }
}
