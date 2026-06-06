'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  BookOpen,
  ClipboardList,
  LayoutGrid,
  TrendingUp,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function AdminDashboard() {
  const { stats, setStats, setCurrentView, loading, setLoading, showToast } = useAppStore()
  const router = useRouter()
  const { toast } = useToast()

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (res.ok) setStats(data)
    } catch {
      toast({ title: 'Error', description: 'Error al cargar estadísticas', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [setStats, setLoading, toast])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const goTo = (view: string) => {
    setCurrentView(view as any)
    router.push('/')
  }

  const statCards = [
    {
      label: 'Estudiantes',
      value: stats?.totalStudents ?? 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      description: 'Estudiantes activos'
    },
    {
      label: 'Cursos',
      value: stats?.totalCourses ?? 0,
      icon: BookOpen,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
      description: 'Cursos disponibles'
    },
    {
      label: 'Inscripciones',
      value: stats?.totalEnrollments ?? 0,
      icon: ClipboardList,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
      description: 'Inscripciones activas'
    },
    {
      label: 'Categorías',
      value: stats?.totalCategories ?? 0,
      icon: LayoutGrid,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
      description: 'Áreas de estudio'
    }
  ]

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen general del instituto</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-card-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('admin-courses')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Gestionar Cursos</p>
              <p className="text-xs text-muted-foreground">Crear y editar cursos</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('admin-students')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Estudiantes</p>
              <p className="text-xs text-muted-foreground">Ver todos los estudiantes</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('admin-enrollments')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Inscripciones</p>
              <p className="text-xs text-muted-foreground">Historial de inscripciones</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => goTo('admin-schedule')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Resumen</p>
              <p className="text-xs text-muted-foreground">Estadísticas detalladas</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments */}
      {stats?.recentEnrollments && stats.recentEnrollments.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Inscripciones Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {stats.recentEnrollments.map((enrollment, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {enrollment.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{enrollment.user.name}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.course.title}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(enrollment.enrolledAt).toLocaleDateString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Courses */}
      {stats?.courseStats && stats.courseStats.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Cursos por Popularidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.courseStats.map((course) => (
              <div key={course.id} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-32 truncate">{course.title}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (course._count.enrollments / course.capacity) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {course._count.enrollments}/{course.capacity}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
