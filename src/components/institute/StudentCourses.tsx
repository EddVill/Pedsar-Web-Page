'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore, type Course } from '@/store/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Loader2, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import CourseCard from './CourseCard'

export default function StudentCourses() {
  const { courses, enrollments, setCourses, currentUser, loading, setLoading } = useAppStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const router = useRouter()
  const { toast } = useToast()

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      if (res.ok) setCourses(data.courses)
    } catch {
      toast({ title: 'Error', description: 'Error al cargar cursos', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [setCourses, setLoading, toast])

  useEffect(() => {
    if (courses.length === 0) fetchCourses()
  }, [])

  const enrolledIds = new Set(enrollments.filter(e => e.status === 'ACTIVO').map(e => e.courseId))

  const categories = [...new Set(courses.map(c => c.category))]
  const levels = ['Básico', 'Intermedio', 'Avanzado']

  const filtered = courses.filter(c => {
    if (!c.isActive) return false
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.instructor.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false
    if (levelFilter !== 'all' && c.level !== levelFilter) return false
    return true
  })

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, courseId })
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
        return
      }
      toast({ title: 'Inscrito', description: 'Te has inscrito exitosamente' })
      // Refresh enrollments
      const enrRes = await fetch(`/api/enrollments?userId=${currentUser.id}`)
      const enrData = await enrRes.json()
      if (enrRes.ok) useAppStore.getState().setEnrollments(enrData.enrollments)
      // Refresh courses for count update
      const coursesRes = await fetch('/api/courses')
      const coursesData = await coursesRes.json()
      if (coursesRes.ok) setCourses(coursesData.courses)
    } catch {
      toast({ title: 'Error', description: 'Error al inscribirse', variant: 'destructive' })
    }
  }

  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) return
    try {
      const res = await fetch(`/api/enrollments?userId=${currentUser.id}&courseId=${courseId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast({ title: 'Cancelado', description: 'Inscripción cancelada' })
        const enrRes = await fetch(`/api/enrollments?userId=${currentUser.id}`)
        const enrData = await enrRes.json()
        if (enrRes.ok) useAppStore.getState().setEnrollments(enrData.enrollments)
        const coursesRes = await fetch('/api/courses')
        const coursesData = await coursesRes.json()
        if (coursesRes.ok) setCourses(coursesData.courses)
      }
    } catch {
      toast({ title: 'Error', description: 'Error al cancelar', variant: 'destructive' })
    }
  }

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explorar Cursos</h1>
        <p className="text-sm text-muted-foreground mt-1">Encuentra el curso perfecto para ti</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 w-[140px]">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {levels.map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>

      {/* Course Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              showEnroll={true}
              enrolled={enrolledIds.has(course.id)}
              onEnroll={handleEnroll}
              onUnenroll={handleUnenroll}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
              No se encontraron cursos con los filtros seleccionados
            </div>
          )}
        </div>
      )}
    </div>
  )
}
