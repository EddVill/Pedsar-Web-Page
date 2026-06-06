'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  ClipboardList,
  UserCircle,
  BookOpen
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchEnrollments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/enrollments')
      const data = await res.json()
      if (res.ok) setEnrollments(data.enrollments)
    } catch {
      toast({ title: 'Error', description: 'Error al cargar inscripciones', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  const statusColor = {
    'ACTIVO': 'bg-emerald-100 text-emerald-700',
    'CANCELADO': 'bg-red-100 text-red-700',
    'COMPLETADO': 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inscripciones</h1>
        <p className="text-sm text-muted-foreground mt-1">{enrollments.length} inscripciones en total</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Estudiante</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Curso</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Estado</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {enrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {e.user?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">{e.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{e.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-card-foreground">{e.course?.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={`${statusColor[e.status as keyof typeof statusColor] || 'bg-slate-100 text-slate-700'} border-0 text-[10px] font-medium px-2 py-0.5`}>
                          {e.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {new Date(e.enrolledAt).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden divide-y divide-border/50">
              {enrollments.map((e) => (
                <div key={e.id} className="px-5 py-3">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0 mt-0.5">
                      {e.user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{e.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{e.course?.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${statusColor[e.status as keyof typeof statusColor] || 'bg-slate-100 text-slate-700'} border-0 text-[10px] font-medium px-1.5 py-0.5`}>
                          {e.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(e.enrolledAt).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {enrollments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No hay inscripciones registradas
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
