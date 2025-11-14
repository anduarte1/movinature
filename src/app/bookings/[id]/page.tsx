"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, CheckCircle, DollarSign, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Id } from "@convex/_generated/dataModel";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const bookingId = params.id as Id<"bookings">;

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // Fetch booking details
  const booking = useQuery(
    api.bookings.getById,
    bookingId ? { id: bookingId } : "skip"
  );

  // Loading state
  if (!isLoaded || booking === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes da reserva...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Reserva Não Encontrada</h2>
          <Button asChild>
            <Link href="/bookings">Voltar para Reservas</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          color: "bg-green-500",
          icon: CheckCircle,
          message: "Sua reserva foi confirmada!",
        };
      case "PENDING":
        return {
          color: "bg-yellow-500",
          icon: Clock,
          message: "Sua reserva está aguardando confirmação",
        };
      case "CANCELLED":
        return {
          color: "bg-red-500",
          icon: Clock,
          message: "Esta reserva foi cancelada",
        };
      case "COMPLETED":
        return {
          color: "bg-blue-500",
          icon: CheckCircle,
          message: "Esta atividade foi concluída",
        };
      default:
        return {
          color: "bg-gray-500",
          icon: Clock,
          message: "Status da reserva desconhecido",
        };
    }
  };

  const statusDetails = getStatusDetails(booking.status);
  const StatusIcon = statusDetails.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Reserva Confirmada!
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Sua aventura está te esperando. Enviamos os detalhes da confirmação para seu e-mail.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Booking Status */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <StatusIcon className={`h-8 w-8 text-white p-1.5 rounded-full ${statusDetails.color}`} />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold">{statusDetails.message}</p>
                </div>
                <Badge className={`ml-auto ${statusDetails.color}`}>
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity Details */}
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50">
              <CardTitle className="text-2xl">Detalhes da Atividade</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Activity Image */}
                <div className="relative h-48 w-64 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={booking.activity.images?.[0] || "/placeholder.jpg"}
                    alt={booking.activity.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Activity Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{booking.activity.title}</h3>
                    <p className="text-gray-600 line-clamp-3">
                      {booking.activity.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span>{booking.activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>
                        {booking.participants}{" "}
                        {booking.participants === 1 ? "participante" : "participantes"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Detalhes do Preço
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>
                    ${booking.activity.price} × {booking.participants}{" "}
                    {booking.participants === 1 ? "pessoa" : "pessoas"}
                  </span>
                  <span className="font-medium">${booking.totalPrice}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">${booking.totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Host Information */}
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50">
              <CardTitle>Seu Anfitrião</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  {booking.activity.host?.image ? (
                    <Image
                      src={booking.activity.host.image}
                      alt={booking.activity.host.name || "Anfitrião"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {booking.activity.host?.name?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {booking.activity.host?.name || "Anfitrião"}
                  </p>
                  <p className="text-sm text-gray-600">Anfitrião da Atividade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              asChild
            >
              <Link href="/bookings">
                <Home className="h-5 w-5 mr-2" />
                Ver Todas as Reservas
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-green-200 hover:border-green-400"
              asChild
            >
              <Link href="/activities">Explorar Mais Atividades</Link>
            </Button>
          </div>

          {/* Booking ID Reference */}
          <div className="text-center text-sm text-gray-500 pt-4">
            Referência da Reserva: <span className="font-mono font-medium">{booking._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
