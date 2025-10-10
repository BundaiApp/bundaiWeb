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

export const setAuthData = (loginData) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const { token, user } = loginData
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
      }
      if (user) {
        localStorage.setItem('userId', user._id)
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('userName', user.name || user.email.split('@')[0])
        localStorage.setItem('verified', 'false')
        localStorage.setItem('passed', 'true')
      }
      window.dispatchEvent(new Event('bundai:auth-change'))
    }
  } catch (error) {
    console.error('Failed to set auth data:', error)
  }
}

export const getAuthData = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    const userId = localStorage.getItem('userId')
    const userEmail = localStorage.getItem('userEmail')
    const userName = localStorage.getItem('userName')
    const verified = localStorage.getItem('verified')
    const passed = localStorage.getItem('passed')

    if (!token || !userId) {
      return null
    }

    return {
      token,
      userId,
      email: userEmail,
      username: userName,
      verified: verified === 'true',
      passed: passed === 'true',
      loggedIn: true
    }
  } catch (error) {
    console.error('Failed to get auth data:', error)
    return null
  }
}

export const clearAuthToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('verified')
      localStorage.removeItem('passed')
      window.dispatchEvent(new Event('bundai:auth-change'))
    }
  } catch (error) {
    console.error('Failed to clear auth token:', error)
  }
}
