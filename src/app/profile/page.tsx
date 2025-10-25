import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          Booking: true,
          Activity: true,
          Review: true,
          Favorite: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your activity
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{user.name || "User"}</h2>
                    <Badge>{user.role}</Badge>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </Button>
                </div>

                <div className="space-y-2 text-muted-foreground">
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {user.bio && (
                  <p className="mt-4 text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold mb-1">{user._count.Booking}</div>
              <div className="text-sm text-muted-foreground">Bookings</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold mb-1">{user._count.Favorite}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold mb-1">{user._count.Review}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </CardContent>
          </Card>

          {user.role === "HOST" && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold mb-1">{user._count.Activity}</div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/bookings">
                <div className="text-left">
                  <div className="font-semibold mb-1">My Bookings</div>
                  <div className="text-sm text-muted-foreground">
                    View and manage your bookings
                  </div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/favorites">
                <div className="text-left">
                  <div className="font-semibold mb-1">Favorites</div>
                  <div className="text-sm text-muted-foreground">
                    Your saved activities
                  </div>
                </div>
              </Link>
            </Button>

            {user.role === "HOST" && (
              <Button variant="outline" className="h-auto py-4" asChild>
                <Link href="/host">
                  <div className="text-left">
                    <div className="font-semibold mb-1">Host Dashboard</div>
                    <div className="text-sm text-muted-foreground">
                      Manage your activities
                    </div>
                  </div>
                </Link>
              </Button>
            )}

            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/activities">
                <div className="text-left">
                  <div className="font-semibold mb-1">Browse Activities</div>
                  <div className="text-sm text-muted-foreground">
                    Discover new adventures
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
