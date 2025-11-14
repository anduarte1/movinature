"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Search, MapPin, Calendar, Heart, Star } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomePage() {
  const router = useRouter();

  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Fetch categories and featured activities from Convex
  const categories = useQuery(api.categories.list);
  const featuredActivities = useQuery(api.activities.getFeatured, { limit: 4 });

  // Show loading state while data is being fetched
  const isLoading = categories === undefined || featuredActivities === undefined;

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchKeyword) params.set("search", searchKeyword);
    if (searchLocation) params.set("location", searchLocation);
    if (searchDate) params.set("date", searchDate);

    router.push(`/activities?${params.toString()}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div
            className="relative flex min-h-[480px] flex-col gap-6 rounded-xl items-center justify-center p-6 text-center overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(38, 70, 83, 0.3) 0%, rgba(38, 70, 83, 0.6) 100%), url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1600&h=600&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex flex-col gap-2 z-10">
              <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight max-w-4xl">
                Descubra Aventuras Inesquecíveis em Família
              </h1>
              <h2 className="text-white text-base sm:text-lg font-normal leading-normal max-w-2xl mx-auto">
                Reserve atividades únicas na natureza e físicas para crianças de todas as idades.
              </h2>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-3xl mt-4 bg-white p-2 rounded-full shadow-lg flex flex-col md:flex-row items-center gap-2 z-10">
              <div className="flex flex-1 w-full items-center">
                <Search className="h-5 w-5 text-gray-400 ml-4 mr-2" />
                <input
                  type="text"
                  placeholder="Atividade ou palavra-chave"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
              <div className="flex flex-1 w-full items-center">
                <MapPin className="h-5 w-5 text-gray-400 ml-4 mr-2" />
                <input
                  type="text"
                  placeholder="Localização"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
              <div className="flex flex-1 w-full items-center">
                <Calendar className="h-5 w-5 text-gray-400 ml-4 mr-2" />
                <input
                  type="text"
                  placeholder="Data"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="w-full md:w-auto rounded-full bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-6 h-12"
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight pb-6 text-gray-900">Explorar por Categoria</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                // Placeholder images for categories
                const categoryImages: { [key: string]: string } = {
                  hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop",
                  "nature-walks": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
                  "martial-arts": "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=400&fit=crop",
                  dance: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=400&fit=crop",
                  swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop",
                  "rock-climbing": "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=400&fit=crop",
                };
                const categoryImage = category.icon || categoryImages[category.slug] || "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop";

                return (
                  <Link
                    key={category._id}
                    href={`/activities?category=${category.slug}`}
                    className="group relative flex flex-col items-center justify-center gap-3 rounded-xl p-4 aspect-square overflow-hidden transition-transform duration-300 hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(0deg, rgba(38, 70, 83, 0.6) 0%, rgba(38, 70, 83, 0) 50%), url('${categoryImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <p className="text-white text-lg font-bold leading-tight z-10 text-center">{category.name}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">Nenhuma categoria disponível ainda.</p>
          )}
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight pb-6 text-gray-900">Atividades em Destaque</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          ) : featuredActivities && featuredActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredActivities.map((activity) => {
                const activityImage = activity.images && activity.images.length > 0
                  ? activity.images[0]
                  : "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=800&fit=crop";
                const ageRange = `Idades ${activity.minAge}-${activity.maxAge}`;

                return (
                  <Link key={activity._id} href={`/activities/${activity._id}`} className="flex flex-col gap-3 group">
                    <div className="relative overflow-hidden rounded-xl">
                      <div
                        className="aspect-square w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url('${activityImage}')` }}
                      />
                      <div className="absolute top-3 right-3">
                        <FavoriteButton activityId={activity._id} className="size-9 p-2" showToast />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg leading-tight text-gray-900">{activity.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <Star className="h-4 w-4 fill-[#E9C46A] text-[#E9C46A]" />
                          <span className="font-medium text-sm text-gray-900">{activity.rating || 0}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{ageRange}, {activity.location}</p>
                      <p className="font-bold mt-1 text-gray-900">
                        ${activity.price} <span className="font-normal text-gray-600">/ pessoa</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">Nenhuma atividade em destaque disponível ainda. Volte em breve!</p>
          )}
        </div>
      </section>

      {/* Become a Host CTA */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div
            className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl p-8 md:p-12 overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(75deg, rgba(233, 196, 106, 0.95) 0%, rgba(233, 196, 106, 0.7) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Compartilhe Sua Paixão com a Comunidade</h2>
              <p className="mt-2 max-w-2xl text-gray-800">
                Transforme suas habilidades em trilhas, artesanato, esportes ou qualquer outra atividade em uma experiência inesquecível para as famílias. Torne-se um anfitrião e ganhe dinheiro fazendo o que você ama.
              </p>
            </div>
            <div className="relative z-10">
              <Button asChild className="rounded-full bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-8 h-12 shadow-lg text-base font-bold">
                <Link href="/host">Seja um Anfitrião</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-10 pt-10 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-gray-900">
                <div className="text-[#2A9D8F]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                    <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-bold">movinature</h2>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-gray-900">Empresa</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Sobre</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Carreiras</Link></li>
                <li><Link href="/press" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Imprensa</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-gray-900">Suporte</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Central de Ajuda</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Fale Conosco</Link></li>
                <li><Link href="/safety" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Confiança & Segurança</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-gray-900">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Termos de Serviço</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-[#2A9D8F] transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-bold mb-3 text-gray-900">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-2">Receba inspiração para sua próxima viagem em família.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1 rounded-l-full border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                />
                <Button className="rounded-r-full bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-4">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2024 movinature, Inc. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
