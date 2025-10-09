export const TOKEN_STORAGE_KEY = 'bundaiAuthToken'

export const hasAuthToken = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }

    return Boolean(window.localStorage.getItem(TOKEN_STORAGE_KEY))
  } catch {
    return false
  }
}

export const clearAuthToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.dispatchEvent(new Event('bundai:auth-change'))
    }
  } catch (error) {
    console.error('Failed to clear auth token:', error)
  }
}
