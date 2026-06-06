import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { isActive: true },
      include: {
        schedules: true,
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ courses })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, description, image, category, level, duration, capacity, price, instructor, isActive, schedules } = data

    if (!title || !description || !category || !instructor) {
      return NextResponse.json({ error: 'Título, descripción, categoría e instructor son requeridos' }, { status: 400 })
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        image: image || null,
        category,
        level: level || 'Básico',
        duration: duration || '8 semanas',
        capacity: capacity || 30,
        price: price || 0,
        instructor,
        isActive: isActive !== false,
        schedules: schedules ? {
          create: schedules
        } : undefined
      },
      include: { schedules: true }
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear curso' }, { status: 500 })
  }
}
