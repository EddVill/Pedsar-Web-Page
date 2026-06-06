'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Calendar,
  ClipboardList,
  ArrowRight,
  Loader2,
  GraduationCap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function StudentDashboard() {
  const { currentUser, enrollments, courses, setEnrollments, setCourses, loading, setLoading } = useAppStore()
  const router = useRouter()
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch(`/api/enrollments?userId=${currentUser.id}`)
      ])
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        setCourses(coursesData.courses)
      }
      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json()
        setEnrollments(enrollmentsData.enrollments)
      }
    } catch {
      toast({ title: 'Error', description: 'Error al cargar datos', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [currentUser, setCourses, setEnrollments, setLoading, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const myCourses = enrollments.filter(e => e.status === 'ACTIVO')
  const availableCourses = courses.filter(c => c.isActive)

  const goTo = (view: string) => {
    useAppStore.getState().setCurrentView(view as any)
    router.push('/')
  }

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 sm:p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/30 blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">Bienvenido(a)</p>
              <h1 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h1>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/80 mt-2">
            {myCourses.length > 0
              ? `Tienes ${myCourses.length} curso${myCourses.length > 1 ? 's' : ''} activo${myCourses.length > 1 ? 's' : ''}. ¡Sigue aprendiendo!`
              : 'Explora nuestro catálogo e inscríbete en los cursos que te interesen.'
            }
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-card-foreground">{myCourses.length}</p>
                <p className="text-[10px] text-muted-foreground">Mis Cursos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-card-foreground">{availableCourses.length}</p>
                <p className="text-[10px] text-muted-foreground">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-card-foreground">
                  {myCourses.reduce((acc, e) => acc + (e.course?.schedules?.length || 0), 0)}
                </p>
                <p className="text-[10px] text-muted-foreground">Clases/Semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-card-foreground">B+</p>
                <p className="text-[10px] text-muted-foreground">Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('student-courses')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Explorar Cursos</p>
              <p className="text-xs text-muted-foreground">Encuentra tu próximo curso</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('student-enrolled')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Mis Cursos</p>
              <p className="text-xs text-muted-foreground">Cursos inscritos</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('student-schedule')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Mi Horario</p>
              <p className="text-xs text-muted-foreground">Calendario semanal</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* My Courses Preview */}
      {myCourses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Mis Cursos Activos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.slice(0, 3).map((enrollment) => (
              <Card key={enrollment.id} className="border-border/50 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => goTo('student-enrolled')}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {enrollment.course?.image ? (
                      <img src={enrollment.course.image} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-card-foreground truncate">{enrollment.course?.title}</h3>
                      <p className="text-xs text-muted-foreground">{enrollment.course?.instructor}</p>
                      <div className="flex gap-1 mt-1">
                        {enrollment.course?.schedules?.slice(0, 2).map((s) => (
                          <Badge key={s.id} variant="secondary" className="text-[9px] px-1.5 py-0">
                            {s.dayOfWeek} {s.startTime}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
