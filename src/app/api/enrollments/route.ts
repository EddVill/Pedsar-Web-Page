import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (userId) {
      const enrollments = await db.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: { schedules: true }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      })
      return NextResponse.json({ enrollments })
    }

    if (courseId) {
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        include: {
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { enrolledAt: 'desc' }
      })
      return NextResponse.json({ enrollments })
    }

    const enrollments = await db.enrollment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: true
      },
      orderBy: { enrolledAt: 'desc' }
    })
    return NextResponse.json({ enrollments })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json()

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Usuario y curso son requeridos' }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { _count: { select: { enrollments: true } } }
    })

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    if (!course.isActive) {
      return NextResponse.json({ error: 'El curso no está disponible' }, { status: 400 })
    }

    if (course._count.enrollments >= course.capacity) {
      return NextResponse.json({ error: 'El curso ya está lleno' }, { status: 400 })
    }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    })

    if (existing) {
      return NextResponse.json({ error: 'Ya estás inscrito en este curso' }, { status: 409 })
    }

    const enrollment = await db.enrollment.create({
      data: { userId, courseId }
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al inscribirse' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Usuario y curso son requeridos' }, { status: 400 })
    }

    await db.enrollment.delete({
      where: { userId_courseId: { userId, courseId } }
    })

    return NextResponse.json({ message: 'Inscripción cancelada' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al cancelar inscripción' }, { status: 500 })
  }
}
