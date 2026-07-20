import type { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

export interface User {
  id: string
  username: string
  nama: string
  role:
    | 'Superadmin'
    | 'Editor Konten'
    | 'Operator Infografis'
    | 'Petugas Pengaduan'
    | 'Editor'
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: (message?: string) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000 // 15 menit
const ABSOLUTE_SESSION_LIMIT_MS = 12 * 60 * 60 * 1000 // 12 jam

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback((message?: string) => {
    setUser(null)
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_login_timestamp')
    localStorage.removeItem('admin_last_activity')
    
    if (message) {
      toast.error(message)
    }
  }, [])

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('admin_user')
      const loginTimestamp = localStorage.getItem('admin_login_timestamp')
      
      if (storedUser && loginTimestamp) {
        const timeElapsed = Date.now() - parseInt(loginTimestamp, 10)
        
        if (timeElapsed > ABSOLUTE_SESSION_LIMIT_MS) {
          // Absolute session expired
          logout('Sesi Anda telah kedaluwarsa. Silakan login kembali.')
        } else {
          setUser(JSON.parse(storedUser))
          localStorage.setItem('admin_last_activity', Date.now().toString())
        }
      } else if (storedUser) {
        // Fallback for existing sessions without timestamp
        setUser(JSON.parse(storedUser))
        localStorage.setItem('admin_login_timestamp', Date.now().toString())
        localStorage.setItem('admin_last_activity', Date.now().toString())
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage')
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  // Inactivity tracking
  useEffect(() => {
    if (!user) return

    let intervalId: ReturnType<typeof setInterval>

    const updateActivity = () => {
      localStorage.setItem('admin_last_activity', Date.now().toString())
    }

    const checkInactivity = () => {
      const lastActivityStr = localStorage.getItem('admin_last_activity')
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10)
        const inactiveTime = Date.now() - lastActivity
        
        if (inactiveTime > INACTIVITY_LIMIT_MS) {
          logout('Sesi Anda berakhir karena tidak ada aktivitas selama 15 menit. Silakan login kembali.')
        }
      }
    }

    // Update activity on these events
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true })
    })

    // Check inactivity every 1 minute
    intervalId = setInterval(checkInactivity, 60000)

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
      clearInterval(intervalId)
    }
  }, [user, logout])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('admin_user', JSON.stringify(userData))
    localStorage.setItem('admin_login_timestamp', Date.now().toString())
    localStorage.setItem('admin_last_activity', Date.now().toString())
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
