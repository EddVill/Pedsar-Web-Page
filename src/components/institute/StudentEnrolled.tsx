'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  BookOpen,
  MapPin,
  Clock,
  Trash2,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function StudentEnrolled() {
  const { currentUser, enrollments, setEnrollments, loading, setLoading } = useAppStore()
  const router = useRouter()
  const { toast } = useToast()

  const fetchEnrollments = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch(`/api/enrollments?userId=${currentUser.id}`)
      const data = await res.json()
      if (res.ok) setEnrollments(data.enrollments)
    } catch {
      toast({ title: 'Error', description: 'Error al cargar cursos', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [currentUser, setEnrollments, setLoading, toast])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) return
    try {
      const res = await fetch(`/api/enrollments?userId=${currentUser.id}&courseId=${courseId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast({ title: 'Cancelado', description: 'Inscripción cancelada' })
        fetchEnrollments()
      }
    } catch {
      toast({ title: 'Error', description: 'Error al cancelar', variant: 'destructive' })
    }
  }

  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVO')

  const statusColor = {
    'ACTIVO': 'bg-emerald-100 text-emerald-700',
    'CANCELADO': 'bg-red-100 text-red-700',
    'COMPLETADO': 'bg-blue-100 text-blue-700',
  }

  const levelColor = {
    'Básico': 'bg-emerald-100 text-emerald-700',
    'Intermedio': 'bg-amber-100 text-amber-700',
    'Avanzado': 'bg-rose-100 text-rose-700',
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Cursos</h1>
          <p className="text-sm text-muted-foreground mt-1">{activeEnrollments.length} curso{activeEnrollments.length !== 1 ? 's' : ''} activo{activeEnrollments.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" onClick={() => {
          useAppStore.getState().setCurrentView('student-courses')
          router.push('/')
        }}>
          <BookOpen className="h-4 w-4 mr-2" />
          Explorar Más
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activeEnrollments.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground">Aún no estás inscrito</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Explora nuestro catálogo de cursos y comienza tu aprendizaje.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                useAppStore.getState().setCurrentView('student-courses')
                router.push('/')
              }}
            >
              Ver Cursos Disponibles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeEnrollments.map((enrollment) => {
            const course = enrollment.course
            return (
              <Card key={enrollment.id} className="border-border/50 hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {course?.image ? (
                        <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm text-card-foreground">{course?.title}</h3>
                            <Badge className={`${levelColor[course?.level as keyof typeof levelColor] || 'bg-slate-100 text-slate-700'} border-0 text-[10px] font-medium px-1.5 py-0.5`}>
                              {course?.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{course?.instructor}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-8 text-xs flex-shrink-0"
                          onClick={() => handleUnenroll(enrollment.courseId)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Cancelar
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course?.description}</p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course?.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {course?.schedules?.[0]?.classroom || 'Sin aula asignada'}
                        </span>
                        <span>{formatPrice(course?.price || 0)}</span>
                      </div>

                      {/* Schedule tags */}
                      {course?.schedules && course.schedules.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {course.schedules.map((s: any) => (
                            <Badge key={s.id} variant="secondary" className="text-[10px] px-2 py-0.5">
                              {s.dayOfWeek} {s.startTime}-{s.endTime}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
