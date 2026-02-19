import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    // Get or create demo user if no session
    let userId = session?.user?.id
    if (!userId) {
      let demoUser = await prisma.user.findUnique({
        where: { email: 'demo@aibuilder.local' }
      })
      
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@aibuilder.local',
            name: 'Demo User',
          }
        })
      }
      userId = demoUser.id
    }

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Parse files JSON string back to object
    const projectWithFiles = {
      ...project,
      files: JSON.parse(project.files)
    }

    return NextResponse.json(projectWithFiles)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    // Get or create demo user if no session
    let userId = session?.user?.id
    if (!userId) {
      let demoUser = await prisma.user.findUnique({
        where: { email: 'demo@aibuilder.local' }
      })
      
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@aibuilder.local',
            name: 'Demo User',
          }
        })
      }
      userId = demoUser.id
    }

    const body = await request.json()
    const { name, description, files } = body

    const project = await prisma.project.update({
      where: {
        id,
        userId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(files && { files: JSON.stringify(files) }),
        updatedAt: new Date(),
      },
    })

    // Parse files back to object for response
    const projectWithFiles = {
      ...project,
      files: JSON.parse(project.files)
    }

    return NextResponse.json(projectWithFiles)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.project.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
