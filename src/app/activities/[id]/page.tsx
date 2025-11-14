"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Users,
  Clock,
  Droplet,
  Cookie,
  Car,
  Camera,
  Heart,
  Share2,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = params.id as Id<"activities">;

  // Fetch activity from Convex
  const activity = useQuery(api.activities.getById, { id: activityId });

  const [guests, setGuests] = useState(2);

  // Show loading state
  if (activity === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17cf17] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando atividade...</p>
        </div>
      </div>
    );
  }

  // Show not found
  if (activity === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Atividade Não Encontrada</h1>
          <p className="text-gray-600 mb-4">A atividade que você procura não existe.</p>
          <Button asChild>
            <Link href="/activities">Explorar Atividades</Link>
          </Button>
        </div>
      </div>
    );
  }

  const serviceFee = 21;
  const subtotal = activity.price * guests;
  const total = subtotal + serviceFee;

  // Format duration (assuming it's in minutes from the schema)
  const durationHours = Math.floor(activity.duration / 60);
  const durationMinutes = activity.duration % 60;
  const durationText = durationHours > 0
    ? `${durationHours} hora${durationHours > 1 ? 's' : ''}${durationMinutes > 0 ? ` ${durationMinutes} min` : ''}`
    : `${durationMinutes} minutos`;

  // Static data for highlights and included items (could be added to schema later)
  const highlights = [
    {
      icon: Users,
      title: "Amigável para Famílias",
      description: `Perfeito para idades ${activity.minAge}-${activity.maxAge}.`,
    },
    {
      icon: Users,
      title: "Equipamento Fornecido",
      description: "Todo o equipamento necessário está incluído.",
    },
    {
      icon: Star,
      title: "Guia Experiente",
      description: `${activity.host.name} é um guia certificado com anos de experiência.`,
    },
  ];

  const included = [
    { icon: Users, label: "Equipamento & Material" },
    { icon: Heart, label: "Equipamento de Segurança" },
    { icon: Droplet, label: "Água Engarrafada" },
    { icon: Cookie, label: "Lanches Leves" },
    { icon: Car, label: "Estacionamento Gratuito" },
    { icon: Camera, label: "Fotos Digitais" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#17cf17]">
              Início
            </Link>
            <span>/</span>
            <Link href="/activities" className="hover:text-[#17cf17]">
              Atividades
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">{activity.title}</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-2">
            {activity.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-700">
            <Star className="h-5 w-5 fill-[#17cf17] text-[#17cf17]" />
            <span className="font-bold">{activity.rating}</span>
            <span className="text-gray-500">({activity.reviewCount} avaliações)</span>
            <span className="mx-1">·</span>
            <Link href="#" className="font-medium underline hover:text-[#17cf17]">
              {activity.location}
            </Link>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8 grid grid-cols-4 grid-rows-2 gap-2 h-[500px] overflow-hidden rounded-xl">
          <div
            className="col-span-4 row-span-2 lg:col-span-2 bg-center bg-cover"
            style={{ backgroundImage: `url('${activity.images && activity.images.length > 0 ? activity.images[0] : "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=800&fit=crop"}')` }}
          />
          {activity.images && activity.images.slice(1).map((image, index) => (
            <div
              key={index}
              className="hidden lg:block col-span-1 row-span-1 bg-center bg-cover"
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
          <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm font-bold">
            <ImageIcon className="h-5 w-5" />
            Ver todas as fotos
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Host Information */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Hospedado por {activity.host.name}
                </h2>
                <p className="text-gray-600">
                  Atividade para até {activity.capacity} convidados · {durationText}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full bg-cover bg-center ring-2 ring-[#17cf17]/50"
                  style={{ backgroundImage: `url('${activity.host.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"}')` }}
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="border-b border-gray-300 pb-8 flex flex-col gap-4">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <Icon className="h-6 w-6 text-[#17cf17] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900">{highlight.title}</p>
                      <p className="text-gray-600 text-sm">{highlight.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="border-b border-gray-300 pb-8">
              <p className="text-base leading-relaxed text-gray-700">{activity.description}</p>
            </div>

            {/* What's Included */}
            <div className="border-b border-gray-300 pb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">O Que Está Incluído</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                {included.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#17cf17]" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-6 w-6 fill-[#17cf17] text-[#17cf17]" />
                <h3 className="text-xl font-bold text-gray-900">
                  {activity.rating} ({activity.reviewCount} avaliações)
                </h3>
              </div>
              {activity.reviews && activity.reviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activity.reviews.map((review) => (
                      <div key={review.id} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${review.user.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"}')` }}
                          />
                          <div>
                            <p className="font-bold text-gray-900">{review.user.name}</p>
                            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6 border-gray-900 text-gray-900 hover:bg-gray-100"
                  >
                    Mostrar todas as {activity.reviewCount} avaliações
                  </Button>
                </>
              ) : (
                <p className="text-gray-600">Ainda sem avaliações. Seja o primeiro a avaliar esta atividade!</p>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-lg">
                <div className="flex items-baseline justify-between mb-6">
                  <p>
                    <span className="text-2xl font-bold text-gray-900">${activity.price}</span>{" "}
                    <span className="text-gray-600">/ pessoa</span>
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-[#17cf17] text-[#17cf17]" />
                    <span className="font-bold text-gray-900">{activity.rating}</span>
                    <span className="text-gray-500">({activity.reviewCount})</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gray-300">
                    <div className="bg-white p-3">
                      <label className="block text-xs font-bold uppercase mb-1 text-gray-900">
                        Data
                      </label>
                      <input
                        type="text"
                        value="Selecionar Data"
                        className="w-full border-none p-0 text-sm bg-transparent focus:ring-0 text-gray-700"
                        readOnly
                      />
                    </div>
                    <div className="bg-white p-3 border-l border-gray-300">
                      <label className="block text-xs font-bold uppercase mb-1 text-gray-900">
                        Horário
                      </label>
                      <input
                        type="text"
                        value="10:00 AM"
                        className="w-full border-none p-0 text-sm bg-transparent focus:ring-0 text-gray-700"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="rounded-lg border border-gray-300 p-3">
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-900">
                      Convidados
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full border-none p-0 text-sm bg-transparent focus:ring-0 text-gray-700"
                    >
                      {[...Array(activity.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i + 1 === 1 ? "convidado" : "convidados"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Book Button */}
                  <Button
                    asChild
                    className="w-full bg-[#17cf17] hover:bg-[#17cf17]/90 text-white h-12 text-base font-bold"
                  >
                    <Link href={`/booking?activity=${activity._id}`}>
                      Reservar Agora
                    </Link>
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-4">Você ainda não será cobrado</p>

                {/* Price Breakdown */}
                <div className="mt-6 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 underline">
                      ${activity.price} x {guests} {guests === 1 ? "convidado" : "convidados"}
                    </span>
                    <span className="text-gray-900">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 underline">Taxa de serviço</span>
                    <span className="text-gray-900">${serviceFee}</span>
                  </div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total}</span>
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
