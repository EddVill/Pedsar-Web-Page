import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const course = await db.course.findUnique({
      where: { id },
      include: {
        schedules: true,
        enrollments: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        _count: { select: { enrollments: true } }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener curso' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const existing = await db.course.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    const course = await db.course.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        description: data.description ?? existing.description,
        image: data.image ?? existing.image,
        category: data.category ?? existing.category,
        level: data.level ?? existing.level,
        duration: data.duration ?? existing.duration,
        capacity: data.capacity ?? existing.capacity,
        price: data.price ?? existing.price,
        instructor: data.instructor ?? existing.instructor,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
      },
      include: { schedules: true }
    })

    return NextResponse.json({ course })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar curso' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.course.delete({ where: { id } })
    return NextResponse.json({ message: 'Curso eliminado' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar curso' }, { status: 500 })
  }
}
