'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore, type Course } from '@/store/app'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  BookOpen,
  Users,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import CourseCard from './CourseCard'

const emptyCourse = {
  title: '',
  description: '',
  image: '',
  category: 'Tecnología',
  level: 'Básico',
  duration: '8 semanas',
  capacity: 30,
  price: 0,
  instructor: '',
  isActive: true,
}

export default function AdminCourses() {
  const { courses, setCourses, loading, setLoading } = useAppStore()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [form, setForm] = useState(emptyCourse)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
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
    fetchCourses()
  }, [fetchCourses])

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditingCourse(null)
    setForm(emptyCourse)
    setDialogOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setForm({
      title: course.title,
      description: course.description,
      image: course.image || '',
      category: course.category,
      level: course.level,
      duration: course.duration,
      capacity: course.capacity,
      price: course.price,
      instructor: course.instructor,
      isActive: course.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description || !form.instructor) {
      toast({ title: 'Error', description: 'Completa los campos requeridos', variant: 'destructive' })
      return
    }
    try {
      if (editingCourse) {
        const res = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (res.ok) {
          toast({ title: 'Actualizado', description: 'Curso actualizado correctamente' })
          setDialogOpen(false)
          fetchCourses()
        }
      } else {
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (res.ok) {
          toast({ title: 'Creado', description: 'Curso creado correctamente' })
          setDialogOpen(false)
          fetchCourses()
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Error al guardar', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Eliminado', description: 'Curso eliminado' })
        setDeleteConfirm(null)
        fetchCourses()
      }
    } catch {
      toast({ title: 'Error', description: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="transition-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Cursos</h1>
          <p className="text-sm text-muted-foreground mt-1">{courses.length} cursos en total</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Curso
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, categoría o instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="border-border/50 hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Image */}
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-card-foreground truncate">{course.title}</h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          {course.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                          {course.level}
                        </Badge>
                        {!course.isActive && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>{course.duration}</span>
                      <span>{formatPrice(course.price)}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course._count.enrollments}/{course.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(course)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(course.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No se encontraron cursos
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm">Título *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10" placeholder="Nombre del curso" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Descripción *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Descripción del curso" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">URL de Imagen</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="h-10" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Categoría *</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10" placeholder="Ej: Tecnología" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Nivel</Label>
                <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Duración</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="h-10" placeholder="Ej: 8 semanas" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Cupo</Label>
                <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })} className="h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Precio (COP)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Instructor *</Label>
                <Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} className="h-10" placeholder="Nombre del instructor" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label className="text-sm">Curso activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingCourse ? 'Guardar' : 'Crear'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Curso</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
