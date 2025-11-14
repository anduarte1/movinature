"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  Lock,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity") as Id<"activities"> | null;
  const { user, isSignedIn } = useUser();

  // Fetch activity details
  const activity = useQuery(
    api.activities.getById,
    activityId ? { id: activityId } : "skip"
  );

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser);

  const createBooking = useMutation(api.bookings.create);

  // Form state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handle booking submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignedIn || !user) {
      setError("Por favor, faça login para completar sua reserva");
      return;
    }

    if (!activityId || !activity) {
      setError("Atividade não encontrada");
      return;
    }

    if (!selectedDate) {
      setError("Por favor, selecione uma data");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user ID from Convex
      if (!currentUser || !currentUser._id) {
        setError("Usuário não encontrado. Por favor, faça logout e login novamente.");
        setIsSubmitting(false);
        return;
      }
      const userId = currentUser._id;

      // Convert date string to Unix timestamp
      const dateTimestamp = new Date(selectedDate).getTime();

      // Calculate end time based on activity duration
      const durationHours = Math.floor(activity.duration / 60);
      const durationMinutes = activity.duration % 60;
      const [startHour, startMinute, startPeriod] = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/)?.slice(1) || [];
      let hour = parseInt(startHour);
      if (startPeriod === "PM" && hour !== 12) hour += 12;
      if (startPeriod === "AM" && hour === 12) hour = 0;

      const endHour = hour + durationHours;
      const endMinute = parseInt(startMinute) + durationMinutes;
      const finalEndHour = endHour + Math.floor(endMinute / 60);
      const finalEndMinute = endMinute % 60;
      const endPeriod = finalEndHour >= 12 ? "PM" : "AM";
      const displayEndHour = finalEndHour > 12 ? finalEndHour - 12 : (finalEndHour === 0 ? 12 : finalEndHour);
      const endTime = `${displayEndHour}:${finalEndMinute.toString().padStart(2, "0")} ${endPeriod}`;

      const bookingId = await createBooking({
        userId,
        activityId,
        date: dateTimestamp,
        startTime: selectedTime,
        endTime: endTime,
        participants: adults + children,
        totalPrice: total,
      });

      // Redirect to confirmation page
      router.push(`/booking-confirmation?id=${bookingId}`);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Falha ao criar reserva. Por favor, tente novamente.");
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (!activityId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Nenhuma Atividade Selecionada
          </h1>
          <p className="text-gray-600 mb-4">
            Por favor, selecione uma atividade para reservar.
          </p>
          <Button asChild>
            <Link href="/activities">Explorar Atividades</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (activity === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes da atividade...</p>
        </div>
      </div>
    );
  }

  if (activity === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Atividade Não Encontrada
          </h1>
          <Button asChild>
            <Link href="/activities">Explorar Atividades</Link>
          </Button>
        </div>
      </div>
    );
  }

  const serviceFee = 15.60;
  const activityFee = activity.price * (adults + children);
  const total = activityFee + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2E7D32] mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">Voltar para atividade</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-[#2F4858] mb-2">
              Complete Sua Reserva
            </h1>
            <p className="text-gray-600 mb-8">
              Você está a apenas alguns passos da sua aventura!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#2F4858] mb-4">
                  Detalhes da Viagem
                </h2>

                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <Calendar className="h-4 w-4 text-[#2E7D32]" />
                      Selecionar Data
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                      required
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <Clock className="h-4 w-4 text-[#2E7D32]" />
                      Selecionar Horário
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                    >
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                    </select>
                  </div>

                  {/* Guests Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <Users className="h-4 w-4 text-[#2E7D32]" />
                      Número de Convidados
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          Adultos
                        </label>
                        <select
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                        >
                          {[...Array(activity.capacity)].map((_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          Crianças
                        </label>
                        <select
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                        >
                          {[...Array(activity.capacity)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#2F4858] mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#2E7D32]" />
                  Informações de Pagamento
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-2 block">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-900 mb-2 block">
                        Data de Validade
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-900 mb-2 block">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="123"
                        maxLength={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-2 block">
                      Nome do Titular
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                    <Lock className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Suas informações de pagamento são criptografadas e seguras. Nunca
                      armazenamos os detalhes completos do seu cartão.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isSignedIn}
                className="w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white h-14 text-lg font-bold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processando...
                  </span>
                ) : (
                  `Confirmar e Pagar $${total.toFixed(2)}`
                )}
              </Button>

              {!isSignedIn && (
                <p className="text-center text-sm text-gray-600">
                  Por favor,{" "}
                  <Link href="/sign-in" className="text-[#2E7D32] font-medium hover:underline">
                    faça login
                  </Link>{" "}
                  para completar sua reserva
                </p>
              )}
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#2F4858] mb-4">
                  Resumo da Reserva
                </h2>

                {/* Activity Info */}
                <div className="flex gap-4 pb-6 border-b border-gray-200">
                  <div
                    className="w-24 h-24 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url('${activity.images?.[0] || ""}')`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activity.location}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Hospedado por {activity.host.name}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="py-6 border-b border-gray-200 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data</span>
                    <span className="font-medium text-gray-900">
                      {selectedDate || "Não selecionada"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário</span>
                    <span className="font-medium text-gray-900">
                      {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convidados</span>
                    <span className="font-medium text-gray-900">
                      {adults} {adults === 1 ? "Adulto" : "Adultos"}
                      {children > 0 &&
                        `, ${children} ${children === 1 ? "Criança" : "Crianças"}`}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="py-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${activity.price} x {adults + children} convidados
                    </span>
                    <span className="text-gray-900">${activityFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de serviço</span>
                    <span className="text-gray-900">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
