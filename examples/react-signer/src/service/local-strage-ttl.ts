class LocalStorageWithTTL {
  setItem(key: string, value: any, ttl: number): void {
    const now = new Date().getTime()

    const item = {
      value: value,
      expiry: now + ttl * 3600000,
    }

    localStorage.setItem(key, JSON.stringify(item))
  }

  getItem(key: string): any | null {
    const itemStr = localStorage.getItem(key)

    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date().getTime()

    if (now > item.expiry) {
      localStorage.removeItem(key)
      return null
    }

    return item.value
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}

export const localStorageTTL = new LocalStorageWithTTL()
