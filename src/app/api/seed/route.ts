import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST() {
  try {
    // Clean existing data
    await db.enrollment.deleteMany()
    await db.schedule.deleteMany()
    await db.course.deleteMany()
    await db.user.deleteMany()

    // Create admin
    const adminPass = await hashPassword('admin123')
    const admin = await db.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@instituto.com',
        password: adminPass,
        role: 'ADMIN'
      }
    })

    // Create demo students
    const studentPass = await hashPassword('student123')
    const student1 = await db.user.create({
      data: {
        name: 'María García',
        email: 'maria@correo.com',
        password: studentPass,
        role: 'STUDENT',
        phone: '+57 300 123 4567'
      }
    })

    const student2 = await db.user.create({
      data: {
        name: 'Carlos López',
        email: 'carlos@correo.com',
        password: studentPass,
        role: 'STUDENT',
        phone: '+57 301 234 5678'
      }
    })

    const student3 = await db.user.create({
      data: {
        name: 'Ana Martínez',
        email: 'ana@correo.com',
        password: studentPass,
        role: 'STUDENT',
        phone: '+57 302 345 6789'
      }
    })

    // Create courses
    const courses = [
      {
        title: 'Programación Web Full Stack',
        description: 'Aprende a crear aplicaciones web completas utilizando HTML, CSS, JavaScript, React y Node.js. El curso incluye proyectos prácticos y preparación para el mundo laboral.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
        category: 'Tecnología',
        level: 'Intermedio',
        duration: '12 semanas',
        capacity: 25,
        price: 0,
        instructor: 'Ing. Roberto Sánchez',
        schedules: {
          create: [
            { dayOfWeek: 'Lunes', startTime: '08:00', endTime: '10:00', classroom: 'Lab 201' },
            { dayOfWeek: 'Miércoles', startTime: '08:00', endTime: '10:00', classroom: 'Lab 201' }
          ]
        }
      },
      {
        title: 'Diseño Gráfico con Adobe',
        description: 'Domina las herramientas de diseño gráfico profesional: Photoshop, Illustrator e InDesign. Crea piezas publicitarias, branding y materiales editoriales de alta calidad.',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
        category: 'Diseño',
        level: 'Básico',
        duration: '10 semanas',
        capacity: 20,
        price: 0,
        instructor: 'Dra. Laura Pérez',
        schedules: {
          create: [
            { dayOfWeek: 'Martes', startTime: '10:00', endTime: '12:00', classroom: 'Lab 102' },
            { dayOfWeek: 'Jueves', startTime: '10:00', endTime: '12:00', classroom: 'Lab 102' }
          ]
        }
      },
      {
        title: 'Inglés para Profesionales',
        description: 'Mejora tu nivel de inglés con enfoque en el entorno empresarial y profesional. Incluye conversación, redacción de emails, presentaciones y vocabulario técnico.',
        image: 'https://images.unsplash.com/photo-1543165796-5426273eaab3?w=600&h=400&fit=crop',
        category: 'Idiomas',
        level: 'Básico',
        duration: '16 semanas',
        capacity: 30,
        price: 150000,
        instructor: 'Prof. James Wilson',
        schedules: {
          create: [
            { dayOfWeek: 'Lunes', startTime: '14:00', endTime: '16:00', classroom: 'Aula 305' },
            { dayOfWeek: 'Miércoles', startTime: '14:00', endTime: '16:00', classroom: 'Aula 305' },
            { dayOfWeek: 'Viernes', startTime: '14:00', endTime: '16:00', classroom: 'Aula 305' }
          ]
        }
      },
      {
        title: 'Marketing Digital y Redes Sociales',
        description: 'Aprende estrategias de marketing digital, gestión de redes sociales, SEO, SEM, email marketing y análisis de datos para potenciar marcas en el entorno digital.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        category: 'Marketing',
        level: 'Intermedio',
        duration: '8 semanas',
        capacity: 30,
        price: 0,
        instructor: 'Lic. Sofía Ramírez',
        schedules: {
          create: [
            { dayOfWeek: 'Martes', startTime: '16:00', endTime: '18:00', classroom: 'Aula 210' },
            { dayOfWeek: 'Jueves', startTime: '16:00', endTime: '18:00', classroom: 'Aula 210' }
          ]
        }
      },
      {
        title: 'Contabilidad y Finanzas',
        description: 'Fundamentos de contabilidad general, estados financieros, presupuestos, impuestos y gestión financiera empresarial. Ideal para emprendedores y profesionales del área.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
        category: 'Finanzas',
        level: 'Básico',
        duration: '10 semanas',
        capacity: 25,
        price: 200000,
        instructor: 'CPN. Andrés Mendoza',
        schedules: {
          create: [
            { dayOfWeek: 'Lunes', startTime: '18:00', endTime: '20:00', classroom: 'Aula 401' },
            { dayOfWeek: 'Miércoles', startTime: '18:00', endTime: '20:00', classroom: 'Aula 401' }
          ]
        }
      },
      {
        title: 'Gestión de Proyectos con Metodologías Ágiles',
        description: 'Domina Scrum, Kanban y las metodologías ágiles más utilizadas en la industria. Aprende a liderar equipos, planificar sprints y gestionar proyectos de manera eficiente.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        category: 'Gestión',
        level: 'Avanzado',
        duration: '6 semanas',
        capacity: 20,
        price: 0,
        instructor: 'Ing. Diana Castillo',
        schedules: {
          create: [
            { dayOfWeek: 'Sábado', startTime: '08:00', endTime: '12:00', classroom: 'Auditorio B' }
          ]
        }
      },
      {
        title: 'Cocina Profesional Internacional',
        description: 'Técnica culinaria de nivel profesional con énfasis en cocina internacional. Aprende técnicas de cocina francesa, italiana, asiática y latinoamericana con chefs experimentados.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop',
        category: 'Gastronomía',
        level: 'Básico',
        duration: '14 semanas',
        capacity: 15,
        price: 350000,
        instructor: 'Chef Alejandro Gómez',
        schedules: {
          create: [
            { dayOfWeek: 'Martes', startTime: '08:00', endTime: '12:00', classroom: 'Cocina Principal' },
            { dayOfWeek: 'Viernes', startTime: '08:00', endTime: '12:00', classroom: 'Cocina Principal' }
          ]
        }
      },
      {
        title: 'Python y Ciencia de Datos',
        description: 'Introducción a Python para análisis de datos, machine learning y visualización. Domina pandas, numpy, matplotlib y scikit-learn con proyectos del mundo real.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        category: 'Tecnología',
        level: 'Intermedio',
        duration: '12 semanas',
        capacity: 25,
        price: 0,
        instructor: 'Ing. Felipe Torres',
        schedules: {
          create: [
            { dayOfWeek: 'Lunes', startTime: '10:00', endTime: '12:00', classroom: 'Lab 301' },
            { dayOfWeek: 'Miércoles', startTime: '10:00', endTime: '12:00', classroom: 'Lab 301' }
          ]
        }
      },
      {
        title: ' Fotografía Profesional',
        description: 'Aprende fotografía desde cero: composición, iluminación, manejo de cámara DSLR, edición en Lightroom y Photoshop. Incluye sesiones de práctica en estudio y exteriores.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
        category: 'Arte',
        level: 'Básico',
        duration: '8 semanas',
        capacity: 18,
        price: 180000,
        instructor: 'Lic. Valentina Cruz',
        schedules: {
          create: [
            { dayOfWeek: 'Sábado', startTime: '09:00', endTime: '13:00', classroom: 'Estudio Fotográfico' }
          ]
        }
      },
      {
        title: 'Excel Avanzado y Power BI',
        description: 'Lleva tus habilidades de Excel al siguiente nivel con macros, VBA, tablas dinámicas, dashboards y Business Intelligence con Microsoft Power BI.',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
        category: 'Tecnología',
        level: 'Intermedio',
        duration: '6 semanas',
        capacity: 25,
        price: 0,
        instructor: 'Ing. Patricia Herrera',
        schedules: {
          create: [
            { dayOfWeek: 'Martes', startTime: '18:00', endTime: '20:00', classroom: 'Lab 105' },
            { dayOfWeek: 'Jueves', startTime: '18:00', endTime: '20:00', classroom: 'Lab 105' }
          ]
        }
      },
      {
        title: 'Psicología Organizacional',
        description: 'Comprende el comportamiento humano en las organizaciones, liderazgo, motivación, clima laboral y gestión del talento humano para crear entornos de trabajo productivos.',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop',
        category: 'Gestión',
        level: 'Avanzado',
        duration: '10 semanas',
        capacity: 30,
        price: 120000,
        instructor: 'Dra. Natalia Ospina',
        schedules: {
          create: [
            { dayOfWeek: 'Viernes', startTime: '16:00', endTime: '20:00', classroom: 'Aula 502' }
          ]
        }
      },
      {
        title: 'Electricidad Industrial',
        description: 'Fundamentos de electricidad, instalaciones eléctricas industriales, automatización, paneles de control y normativas de seguridad industrial.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
        category: 'Técnico',
        level: 'Básico',
        duration: '16 semanas',
        capacity: 20,
        price: 250000,
        instructor: 'Ing. Ricardo Vega',
        schedules: {
          create: [
            { dayOfWeek: 'Lunes', startTime: '16:00', endTime: '20:00', classroom: 'Taller Eléctrico' },
            { dayOfWeek: 'Jueves', startTime: '16:00', endTime: '20:00', classroom: 'Taller Eléctrico' }
          ]
        }
      }
    ]

    for (const courseData of courses) {
      const { schedules, ...courseFields } = courseData as any
      await db.course.create({
        data: {
          ...courseFields,
          schedules: { create: schedules.create }
        }
      })
    }

    // Create some enrollments
    const allCourses = await db.course.findMany()
    await db.enrollment.create({
      data: { userId: student1.id, courseId: allCourses[0].id }
    })
    await db.enrollment.create({
      data: { userId: student1.id, courseId: allCourses[2].id }
    })
    await db.enrollment.create({
      data: { userId: student2.id, courseId: allCourses[0].id }
    })
    await db.enrollment.create({
      data: { userId: student2.id, courseId: allCourses[3].id }
    })
    await db.enrollment.create({
      data: { userId: student2.id, courseId: allCourses[7].id }
    })
    await db.enrollment.create({
      data: { userId: student3.id, courseId: allCourses[1].id }
    })
    await db.enrollment.create({
      data: { userId: student3.id, courseId: allCourses[4].id }
    })

    return NextResponse.json({
      message: 'Datos de ejemplo creados exitosamente',
      admin: { email: 'admin@instituto.com', password: 'admin123' },
      student: { email: 'maria@correo.com', password: 'student123' }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al crear datos' }, { status: 500 })
  }
}
