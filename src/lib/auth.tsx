import type { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  username: string
  nama: string
  role: 'Superadmin' | 'Editor'
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('admin_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('admin_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('admin_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
