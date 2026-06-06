import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const totalStudents = await db.user.count({ where: { role: 'STUDENT' } })
    const totalCourses = await db.course.count({ where: { isActive: true } })
    const totalEnrollments = await db.enrollment.count({ where: { status: 'ACTIVO' } })
    const totalCategories = await db.course.findMany({ select: { category: true } })
    const uniqueCategories = [...new Set(totalCategories.map(c => c.category))]

    const recentEnrollments = await db.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      }
    })

    const courseStats = await db.course.findMany({
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6
    })

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalCategories: uniqueCategories.length,
      recentEnrollments,
      courseStats
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
