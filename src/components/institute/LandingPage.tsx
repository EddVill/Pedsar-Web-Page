'use client'

import { useAppStore, type Course } from '@/store/app'
import {
  BookOpen,
  GraduationCap,
  Users,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useCallback } from 'react'
import CourseCard from './CourseCard'

export default function LandingPage() {
  const { courses, setCurrentView } = useAppStore()
  const router = useRouter()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const handleViewAll = () => {
    setCurrentView('student-courses')
    router.push('/')
  }

  const handleLogin = () => {
    setCurrentView('login')
    router.push('/')
  }

  const handleRegister = () => {
    setCurrentView('register')
    router.push('/')
  }

  return (
    <div className="transition-view">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
              <span className="text-xs font-medium text-primary-foreground">Inscripciones abiertas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
              Transforma tu futuro con nuestra{' '}
              <span className="text-accent-foreground">formación profesional</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-primary-foreground/80 max-w-2xl leading-relaxed">
              Descubre programas de alta calidad diseñados por expertos. Desde tecnología hasta artes,
              encuentra el curso perfecto para impulsar tu carrera profesional.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                onClick={handleViewAll}
              >
                Explorar Cursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                onClick={handleLogin}
              >
                Ya tengo cuenta
              </Button>
            </div>

            {/* Stats mini */}
            <div className="mt-12 flex flex-wrap gap-6 sm:gap-10">
              {[
                { icon: BookOpen, label: 'Cursos', value: courses.length.toString() },
                { icon: Users, label: 'Estudiantes', value: '500+' },
                { icon: Clock, label: 'Horas de clase', value: '2,000+' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary-foreground">{stat.value}</p>
                    <p className="text-xs text-primary-foreground/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">Todo lo que necesitas para alcanzar tus metas profesionales</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'Instructores Expertos',
                description: 'Profesionales con experiencia real en la industria te guiarán paso a paso.',
              },
              {
                icon: TrendingUp,
                title: 'Metodología Práctica',
                description: 'Aprende haciendo con proyectos reales y casos de estudio aplicados.',
              },
              {
                icon: Clock,
                title: 'Horarios Flexibles',
                description: 'Programas diseñados para que estudies sin descuidar tus compromisos.',
              },
              {
                icon: Star,
                title: 'Certificación',
                description: 'Obtén certificados reconocidos que impulsarán tu perfil profesional.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-card-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Carousel */}
      {courses.length > 0 && (
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Cursos Destacados</h2>
                <p className="mt-1 text-sm text-muted-foreground">Descubre los programas más populares</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={scrollPrev} className="h-9 w-9 rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={scrollNext} className="h-9 w-9 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Embla Carousel */}
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {courses.map((course) => (
                  <div key={course.id} className="embla__slide">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile arrows */}
            <div className="flex sm:hidden justify-center gap-2 mt-6">
              <Button variant="outline" size="icon" onClick={scrollPrev} className="h-9 w-9 rounded-full">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollNext} className="h-9 w-9 rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" onClick={handleViewAll}>
                Ver Todos los Cursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
            </div>
            <CardContent className="relative p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">¿Listo para comenzar?</h2>
              <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto text-sm sm:text-base">
                Regístrate hoy y accede a todos nuestros cursos. Comienza tu camino hacia una carrera exitosa.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                  onClick={handleRegister}
                >
                  Crear Cuenta Gratis
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-card-foreground">Instituto de Formación Profesional</span>
            </div>
            <p className="text-xs text-muted-foreground">
              2024 Instituto de Formación Profesional. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
