import { useCallback, useEffect } from 'react'
import { useUserStore } from '@/store/user'

export function useAuth() {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading
  } = useUserStore()

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsAuthenticated(true)
      } else {
        setUser(undefined)
        setIsAuthenticated(false)
      }
    } catch (e) {
      setUser(undefined)
      setIsAuthenticated(false)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [setIsAuthenticated, setIsLoading, setUser])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const signup = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API + '/api/auth/signup',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: '321',
            password: '321',
            email: '123@321.com'
          })
        }
      )

      if (response.ok) {
        signin()
      }
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }
  const signin = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API + '/api/auth/signin',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: '321',
            password: '321'
            // email: "123@321.com"
          })
        }
      )

      if (response.ok) {
        checkAuthStatus()
      }
    } catch (error) {
      console.error('Signin failed:', error)
    }
  }
  const signout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setUser(undefined)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    checkAuthStatus,
    signup,
    signin,
    signout
  }
}
