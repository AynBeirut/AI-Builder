import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  // Development mode: create a demo user if no session
  let userId = session?.user?.id
  if (!userId) {
    // Check if demo user exists, create if not
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
  
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your AI-generated websites
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first project to start building with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                  {project.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{project.framework}</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <Button variant="default" className="w-full">
                      Open Builder
                    </Button>
                  </Link>
                  <Link href={`/dashboard/projects/${project.id}/edit`}>
                    <Button variant="outline">
                      ✏️
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
