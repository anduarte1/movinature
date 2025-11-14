"use client";

export const dynamic = 'force-dynamic';

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar,
  Users,
  User,
  Clock,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") as Id<"bookings"> | null;
  const { user } = useUser();

  // Fetch booking from Convex
  const booking = useQuery(
    api.bookings.getById,
    bookingId ? { id: bookingId } : "skip"
  );

  // Show loading state
  if (!bookingId || booking === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sua reserva...</p>
        </div>
      </div>
    );
  }

  // Show not found
  if (booking === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reserva Não Encontrada
          </h1>
          <p className="text-gray-600 mb-4">
            Não conseguimos encontrar a reserva que você procura.
          </p>
          <Button asChild>
            <Link href="/activities">Explorar Atividades</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate end time (add duration to start time)
  const startTime = booking.startTime;
  const endTime = booking.endTime || "TBD";

  // Get payment details
  const activityFee = booking.totalPrice - 15.60; // Subtract service fee
  const serviceFee = 15.60;
  const handleAddToCalendar = () => {
    // TODO: Implement calendar integration
    console.log("Add to calendar");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-16">
          {/* Success Header */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2E7D32]/20 text-[#2E7D32]">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#2F4858] md:text-4xl">
              Está tudo pronto para sua aventura!
            </h1>
            <p className="mt-3 max-w-xl text-base text-gray-600">
              Um email de confirmação com todos os detalhes foi enviado para {user?.primaryEmailAddress?.emailAddress || "sua caixa de entrada"}.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="mt-12 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Activity Header with Image */}
            <div className="flex flex-col overflow-hidden md:flex-row">
              <div className="w-full md:w-1/2">
                <div
                  className="aspect-video h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${booking.activity?.images?.[0] || ""}')` }}
                />
              </div>
              <div className="flex w-full flex-col justify-center p-6 md:w-1/2">
                <p className="text-sm font-medium text-[#2E7D32]">RESERVA CONFIRMADA</p>
                <h2 className="mt-1 text-2xl font-bold text-[#2F4858]">
                  {booking.activity?.title || "Atividade de Aventura"}
                </h2>
                <p className="mt-2 text-base text-gray-600">
                  {booking.activity?.location || "Local Emocionante"}
                </p>
              </div>
            </div>

            {/* Booking Information Grid */}
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 text-[#2E7D32]" />
                <div>
                  <h3 className="font-bold text-[#2F4858]">Data & Horário</h3>
                  <p className="text-gray-600">{formattedDate}</p>
                  <p className="text-gray-600">
                    {startTime} - {endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-[#2E7D32]" />
                <div>
                  <h3 className="font-bold text-[#2F4858]">Participantes</h3>
                  <p className="text-gray-600">
                    {booking.participants} {booking.participants === 1 ? "Convidado" : "Convidados"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <User className="h-6 w-6 text-[#2E7D32]" />
                <div>
                  <h3 className="font-bold text-[#2F4858]">Anfitrião</h3>
                  <Link
                    href={`/host/${booking.activity?.hostId}`}
                    className="text-[#2E7D32] hover:underline"
                  >
                    {booking.activity?.host?.name || "Anfitrião"}
                  </Link>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#2F4858]">Resumo do Pagamento</h3>
              <div className="mt-4 space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Taxa da Atividade</span>
                  <span>${activityFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Serviço</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-[#2F4858]">
                  <span>Total Pago</span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <CreditCard className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-semibold text-[#2F4858]">
                    Pagamento Confirmado
                  </p>
                  <p className="text-sm text-gray-500">
                    ID da Reserva: {booking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* What to Bring */}
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#2F4858]">O Que Trazer</h3>
              <p className="mt-2 text-gray-600">
                {booking.activity?.description || "Roupas confortáveis, garrafa de água e um espírito de aventura! Confira seu email de confirmação para instruções detalhadas."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 border-t border-gray-200 p-6 sm:flex-row sm:items-center">
              <Button
                onClick={handleAddToCalendar}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-3 text-base font-bold text-white hover:bg-[#2E7D32]/90"
              >
                <Clock className="h-5 w-5" />
                Adicionar ao Calendário
              </Button>
              <Button
                asChild
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2E7D32]/20 px-5 py-3 text-base font-bold text-[#2E7D32] hover:bg-[#2E7D32]/30"
              >
                <Link href="/bookings">Ver Todas as Reservas</Link>
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm">
            <Link
              href={`/contact-host/${booking.activity?.hostId}`}
              className="font-medium text-gray-600 hover:text-[#2E7D32]"
            >
              Contatar o Anfitrião
            </Link>
            <span className="hidden text-gray-400 sm:inline">|</span>
            <Link
              href="/support"
              className="font-medium text-gray-600 hover:text-[#2E7D32]"
            >
              Suporte ao Cliente
            </Link>
            <span className="hidden text-gray-400 sm:inline">|</span>
            <Link
              href="/cancellation-policy"
              className="font-medium text-gray-600 hover:text-[#2E7D32]"
            >
              Política de Cancelamento
            </Link>
            <span className="hidden text-gray-400 sm:inline">|</span>
            <button
              onClick={() => window.print()}
              className="font-medium text-gray-600 hover:text-[#2E7D32]"
            >
              Imprimir Recibo
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2024 movinature. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
