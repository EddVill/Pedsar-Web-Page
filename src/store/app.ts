import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  avatar?: string | null
  createdAt: string
  updatedAt: string
}

export type Course = {
  id: string
  title: string
  description: string
  image: string | null
  category: string
  level: string
  duration: string
  capacity: number
  price: number
  instructor: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  schedules: Schedule[]
  _count: { enrollments: number }
}

export type Schedule = {
  id: string
  courseId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  classroom: string
}

export type Enrollment = {
  id: string
  userId: string
  courseId: string
  status: string
  enrolledAt: string
  updatedAt: string
  course?: Course
  user?: { id: string; name: string; email: string }
}

export type Stats = {
  totalStudents: number
  totalCourses: number
  totalEnrollments: number
  totalCategories: number
  recentEnrollments: { user: { name: string }; course: { title: string }; enrolledAt: string }[]
  courseStats: (Course & { _count: { enrollments: number } })[]
}

type AppView = 'landing' | 'login' | 'register' | 'admin' | 'admin-courses' | 'admin-students' | 'admin-enrollments' | 'admin-schedule' | 'student' | 'student-courses' | 'student-schedule' | 'student-enrolled'

interface AppState {
  // Auth
  currentUser: User | null
  isAuthenticated: boolean

  // Navigation
  currentView: AppView

  // Data
  courses: Course[]
  enrollments: Enrollment[]
  stats: Stats | null

  // UI State
  loading: boolean
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  selectedCourse: Course | null
  sidebarOpen: boolean

  // Actions
  setCurrentUser: (user: User | null) => void
  setCurrentView: (view: AppView) => void
  setCourses: (courses: Course[]) => void
  setEnrollments: (enrollments: Enrollment[]) => void
  setStats: (stats: Stats) => void
  setLoading: (loading: boolean) => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  setSelectedCourse: (course: Course | null) => void
  setSidebarOpen: (open: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      currentView: 'landing',
      courses: [],
      enrollments: [],
      stats: null,
      loading: false,
      toast: null,
      selectedCourse: null,
      sidebarOpen: false,

      setCurrentUser: (user) => set({
        currentUser: user,
        isAuthenticated: !!user,
        currentView: user?.role === 'ADMIN' ? 'admin' : 'student'
      }),

      setCurrentView: (view) => set({ currentView: view }),
      setCourses: (courses) => set({ courses }),
      setEnrollments: (enrollments) => set({ enrollments }),
      setStats: (stats) => set({ stats }),
      setLoading: (loading) => set({ loading }),
      showToast: (message, type) => {
        set({ toast: { message, type } })
        setTimeout(() => set({ toast: null }), 4000)
      },
      setSelectedCourse: (course) => set({ selectedCourse: course }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      logout: () => set({
        currentUser: null,
        isAuthenticated: false,
        currentView: 'landing',
        courses: [],
        enrollments: [],
        stats: null,
        selectedCourse: null
      })
    }),
    {
      name: 'institute-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
