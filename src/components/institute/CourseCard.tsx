'use client'

import { useAppStore, type Course } from '@/store/app'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, BookOpen, ChevronRight, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CourseCardProps {
  course: Course
  showEnroll?: boolean
  enrolled?: boolean
  onEnroll?: (courseId: string) => void
  onUnenroll?: (courseId: string) => void
  onClick?: (course: Course) => void
}

export default function CourseCard({ course, showEnroll, enrolled, onEnroll, onUnenroll, onClick }: CourseCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (onClick) onClick(course)
  }

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (enrolled && onUnenroll) {
      onUnenroll(course.id)
    } else if (!enrolled && onEnroll) {
      onEnroll(course.id)
    }
  }

  const levelColor = {
    'Básico': 'bg-emerald-100 text-emerald-700',
    'Intermedio': 'bg-amber-100 text-amber-700',
    'Avanzado': 'bg-rose-100 text-rose-700',
  }[course.level] || 'bg-slate-100 text-slate-700'

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)
  }

  return (
    <Card
      className="group overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer bg-card"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className={`${levelColor} border-0 text-[11px] font-medium px-2 py-0.5`}>
            {course.level}
          </Badge>
          <Badge variant="secondary" className="bg-white/90 backdrop-blur text-[11px] font-medium px-2 py-0.5">
            {course.category}
          </Badge>
        </div>
        {course.price > 0 && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-0.5 border-0">
            {formatPrice(course.price)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm leading-snug text-card-foreground line-clamp-2 min-h-[2.5rem]">
          {course.title}
        </h3>

        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course._count.enrollments}/{course.capacity}
          </span>
        </div>

        {course.schedules.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {course.schedules.slice(0, 3).map((s) => (
              <span key={s.id} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {s.dayOfWeek} {s.startTime}-{s.endTime}
              </span>
            ))}
            {course.schedules.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5">+{course.schedules.length - 3}</span>
            )}
          </div>
        )}

        {showEnroll && (
          <div className="mt-3 pt-3 border-t border-border/50">
            {enrolled ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={handleAction}
              >
                Cancelar Inscripción
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full h-8 text-xs"
                onClick={handleAction}
                disabled={course._count.enrollments >= course.capacity}
              >
                {course._count.enrollments >= course.capacity ? 'Cupo Lleno' : 'Inscribirme'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
