'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, MapPin, Clock, BookOpen, Calendar, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00', '20:00']

export default function StudentSchedule() {
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
      toast({ title: 'Error', description: 'Error al cargar horario', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [currentUser, setEnrollments, setLoading, toast])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  const myEnrollments = enrollments.filter(e => e.status === 'ACTIVO' && e.course?.schedules)

  // Build schedule grid
  const scheduleMap: Record<string, { course: any; schedule: any; enrollment: any }[]> = {}
  myEnrollments.forEach(enrollment => {
    enrollment.course?.schedules?.forEach((schedule: any) => {
      const key = `${schedule.dayOfWeek}-${schedule.startTime}`
      if (!scheduleMap[key]) scheduleMap[key] = []
      scheduleMap[key].push({ course: enrollment.course, schedule, enrollment })
    })
  })

  const colors = [
    'bg-teal-100 border-teal-200 text-teal-800',
    'bg-amber-100 border-amber-200 text-amber-800',
    'bg-blue-100 border-blue-200 text-blue-800',
    'bg-rose-100 border-rose-200 text-rose-800',
    'bg-purple-100 border-purple-200 text-purple-800',
    'bg-emerald-100 border-emerald-200 text-emerald-800',
  ]

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

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Horario</h1>
        <p className="text-sm text-muted-foreground mt-1">Calendario semanal de tus clases</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : myEnrollments.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground">Sin clases programadas</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Aún no estás inscrito en ningún curso. Explora nuestro catálogo y encuentra cursos que se adapten a tu agenda.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                useAppStore.getState().setCurrentView('student-courses')
                router.push('/')
              }}
            >
              Explorar Cursos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Schedule Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myEnrollments.map((enrollment, i) => (
              <Card key={enrollment.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-card-foreground truncate">{enrollment.course?.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{enrollment.course?.instructor}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {enrollment.course?.schedules?.map((s: any) => (
                          <Badge key={s.id} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                            {s.dayOfWeek} {s.startTime}-{s.endTime}
                          </Badge>
                        ))}
                      </div>
                      {enrollment.course?.schedules?.[0] && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {enrollment.course.schedules[0].classroom}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive flex-shrink-0"
                      onClick={() => handleUnenroll(enrollment.courseId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Grid */}
          <div className="hidden lg:block">
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 w-24 bg-muted/30">Hora</th>
                        {DAYS.map(day => (
                          <th key={day} className="text-left text-xs font-medium text-muted-foreground px-3 py-3 bg-muted/30">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map(time => (
                        <tr key={time} className="border-b border-border/30">
                          <td className="text-xs text-muted-foreground px-3 py-2 bg-muted/20 font-medium whitespace-nowrap">
                            {time}
                          </td>
                          {DAYS.map(day => {
                            const key = `${day}-${time}`
                            const items = scheduleMap[key]
                            return (
                              <td key={day} className="px-1 py-1 align-top h-16">
                                {items?.map((item, i) => (
                                  <div
                                    key={i}
                                    className={`${colors[i % colors.length]} border rounded-md p-1.5 text-[10px] leading-tight cursor-default`}
                                    title={`${item.course.title}\n${item.schedule.startTime}-${item.schedule.endTime}\n${item.schedule.classroom}`}
                                  >
                                    <p className="font-medium truncate">{item.course.title}</p>
                                    <p className="opacity-70">{item.schedule.endTime}</p>
                                    <p className="opacity-50">{item.schedule.classroom}</p>
                                  </div>
                                ))}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
