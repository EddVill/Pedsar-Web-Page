'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Users,
  Mail,
  Phone,
  Loader2,
  UserCircle,
  BookOpen
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (res.ok) {
        setStudents(data.users.filter((u: any) => u.role === 'STUDENT'))
      }
    } catch {
      toast({ title: 'Error', description: 'Error al cargar estudiantes', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estudiantes</h1>
        <p className="text-sm text-muted-foreground mt-1">{students.length} estudiantes registrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar estudiante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <Card key={student.id} className="border-border/50 hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <span className="text-sm font-semibold">{student.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-card-foreground truncate">{student.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{student.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                        <BookOpen className="h-2.5 w-2.5 mr-1" />
                        {student._count?.enrollments || 0} cursos
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        Desde {new Date(student.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
              No se encontraron estudiantes
            </div>
          )}
        </div>
      )}
    </div>
  )
}
