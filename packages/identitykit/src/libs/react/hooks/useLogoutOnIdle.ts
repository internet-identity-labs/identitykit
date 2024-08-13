import { useState } from "react"

export function useLogoutOnIdle() {
  const [idle, setIdle] = useState(false)

  return {
    logoutByIdle: () => {
      setIdle(true)
      setTimeout(() => setIdle(true), 2000)
    },
    shouldLogoutByIdle: idle,
  }
}
