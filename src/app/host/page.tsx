"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Plus, Calendar, DollarSign, Users, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HostDashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // TODO: Get activities by host once we have host data in Convex
  // For now, show empty state
  const activities: any[] = [];

  // Calculate stats
  const totalActivities = activities.length;
  const totalBookings = 0;
  const totalRevenue = 0;
  const avgRating = 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Painel do Anfitrião</h1>
            <p className="text-muted-foreground">
              Gerencie suas atividades e reservas
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/host/new">
              <Plus className="h-5 w-5 mr-2" />
              Criar Atividade
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Atividades</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const activityRating = activity.rating || 0;

                  return (
                    <div
                      key={activity._id}
                      className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="relative h-24 w-32 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={activity.images?.[0] || "/placeholder.jpg"}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{activity.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{activity.category}</Badge>
                              <Badge variant={activity.active ? "default" : "secondary"}>
                                {activity.active ? "Ativa" : "Inativa"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl">${activity.price}</div>
                            <div className="text-xs text-muted-foreground">por pessoa</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{activity.bookingCount || 0} reservas</span>
                          </div>
                          {activity.reviewCount > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{activityRating.toFixed(1)}</span>
                              <span>({activity.reviewCount})</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/activities/${activity._id}`}>Ver</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/host/activities/${activity._id}/edit`}>Editar</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/host/activities/${activity._id}/bookings`}>
                              Gerenciar Reservas
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Você ainda não criou nenhuma atividade.
                </p>
                <Button asChild>
                  <Link href="/host/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Sua Primeira Atividade
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
