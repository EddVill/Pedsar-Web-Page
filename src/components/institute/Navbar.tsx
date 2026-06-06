'use client'

import { useAppStore, type User } from '@/store/app'
import { GraduationCap, LogOut, Menu, X, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { currentUser, isAuthenticated, currentView, setCurrentView, logout, setSidebarOpen } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const goHome = () => {
    setCurrentView('landing')
    router.push('/')
  }

  const goLogin = () => {
    setCurrentView('login')
    router.push('/')
  }

  const adminLinks = [
    { label: 'Dashboard', view: 'admin' as const },
    { label: 'Cursos', view: 'admin-courses' as const },
    { label: 'Estudiantes', view: 'admin-students' as const },
    { label: 'Inscripciones', view: 'admin-enrollments' as const },
  ]

  const studentLinks = [
    { label: 'Mi Panel', view: 'student' as const },
    { label: 'Explorar Cursos', view: 'student-courses' as const },
    { label: 'Mi Horario', view: 'student-schedule' as const },
    { label: 'Mis Cursos', view: 'student-enrolled' as const },
  ]

  const links = currentUser?.role === 'ADMIN' ? adminLinks : studentLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button onClick={goHome} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-foreground">Instituto</span>
            <span className="text-[10px] leading-tight text-muted-foreground hidden sm:block">Formación Profesional</span>
          </div>
        </button>

        {/* Desktop Nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.view}
                onClick={() => { setCurrentView(link.view); router.push('/') }}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentView === link.view
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goLogin} className="text-sm">
                Iniciar Sesión
              </Button>
              <Button size="sm" onClick={() => { setCurrentView('register'); router.push('/') }} className="text-sm">
                Registrarse
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-4">
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <div className="flex flex-col gap-1 mt-8">
                    {links.map((link) => (
                      <button
                        key={link.view}
                        onClick={() => { setCurrentView(link.view); setMobileMenuOpen(false); router.push('/') }}
                        className={`px-3 py-2.5 text-sm rounded-md text-left transition-colors ${
                          currentView === link.view
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserCircle className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{currentUser?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {currentUser?.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
