import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreateActivityForm } from "@/components/create-activity-form"

export default async function NewActivityPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Activity</h1>
          <p className="text-muted-foreground">
            Share your amazing outdoor activity with families
          </p>
        </div>

        <CreateActivityForm categories={categories} userId={session.user.id} />
      </div>
    </div>
  )
}
