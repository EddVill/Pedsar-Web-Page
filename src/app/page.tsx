'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app'
import Navbar from '@/components/institute/Navbar'
import LandingPage from '@/components/institute/LandingPage'
import LoginPage from '@/components/institute/LoginPage'
import RegisterPage from '@/components/institute/RegisterPage'
import AdminDashboard from '@/components/institute/AdminDashboard'
import AdminCourses from '@/components/institute/AdminCourses'
import AdminStudents from '@/components/institute/AdminStudents'
import AdminEnrollments from '@/components/institute/AdminEnrollments'
import StudentDashboard from '@/components/institute/StudentDashboard'
import StudentCourses from '@/components/institute/StudentCourses'
import StudentSchedule from '@/components/institute/StudentSchedule'
import StudentEnrolled from '@/components/institute/StudentEnrolled'

export default function Home() {
  const { currentView, isAuthenticated, currentUser, courses, setCourses, enrollments, setEnrollments, loading, setLoading, toast } = useAppStore()

  // Load courses for the landing page
  useEffect(() => {
    if (courses.length === 0) {
      setLoading(true)
      fetch('/api/courses')
        .then(res => res.json())
        .then(data => {
          if (data.courses) setCourses(data.courses)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [])

  // Load user-specific data when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetch(`/api/enrollments?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.enrollments) setEnrollments(data.enrollments)
        })
        .catch(() => {})
    }
  }, [isAuthenticated, currentUser])

  // Seed data on first visit if no courses
  useEffect(() => {
    if (courses.length === 0) {
      fetch('/api/seed', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.courses || data.message) {
            return fetch('/api/courses').then(r => r.json())
          }
        })
        .then(data => {
          if (data?.courses) setCourses(data.courses)
        })
        .catch(() => {})
    }
  }, [])

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />
      case 'login':
        return <LoginPage />
      case 'register':
        return <RegisterPage />
      case 'admin':
        return currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <LandingPage />
      case 'admin-courses':
        return currentUser?.role === 'ADMIN' ? <AdminCourses /> : <LandingPage />
      case 'admin-students':
        return currentUser?.role === 'ADMIN' ? <AdminStudents /> : <LandingPage />
      case 'admin-enrollments':
        return currentUser?.role === 'ADMIN' ? <AdminEnrollments /> : <LandingPage />
      case 'admin-schedule':
        return currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <LandingPage />
      case 'student':
        return <StudentDashboard />
      case 'student-courses':
        return <StudentCourses />
      case 'student-schedule':
        return <StudentSchedule />
      case 'student-enrolled':
        return <StudentEnrolled />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {renderView()}
      </main>
    </div>
  )
}
