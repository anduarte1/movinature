"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Heart, Star, Grid3x3, List, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

function ActivitiesPageContent() {
  const searchParams = useSearchParams();

  // Get search parameters from URL
  const urlSearch = searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlCategory = searchParams.get("category") || "";

  // Fetch activities from Convex
  const allActivities = useQuery(api.activities.list, {});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [activityFilters, setActivityFilters] = useState({
    nature: false,
    physical: false,
    artsCrafts: false,
  });
  const [audienceFilter, setAudienceFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState(500);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    if (!allActivities) return [];

    let filtered = [...allActivities];

    // Apply URL search filter
    if (urlSearch) {
      const searchLower = urlSearch.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply URL location filter
    if (urlLocation) {
      const locationLower = urlLocation.toLowerCase();
      filtered = filtered.filter((activity) =>
        activity.location.toLowerCase().includes(locationLower)
      );
    }

    // Apply category filter from URL
    if (urlCategory) {
      // This would need category data joined in the query
      // For now, we'll skip this or implement it based on activity type
    }

    // Apply activity type filters
    const activeFilters = Object.entries(activityFilters).filter(([_, active]) => active);
    if (activeFilters.length > 0) {
      // For demo purposes, filtering by title/description keywords
      filtered = filtered.filter((activity) => {
        const content = (activity.title + " " + activity.description).toLowerCase();
        return activeFilters.some(([filter, _]) => {
          if (filter === "nature") return content.includes("nature") || content.includes("hiking") || content.includes("outdoor");
          if (filter === "physical") return content.includes("sport") || content.includes("physical") || content.includes("active");
          if (filter === "artsCrafts") return content.includes("art") || content.includes("craft") || content.includes("creative");
          return false;
        });
      });
    }

    // Apply price filter
    filtered = filtered.filter((activity) => activity.price <= priceRange);

    // Apply audience filter (based on age range)
    if (audienceFilter) {
      filtered = filtered.filter((activity) => {
        if (audienceFilter === "kids") return activity.minAge <= 12;
        if (audienceFilter === "teens") return activity.maxAge >= 13 && activity.minAge <= 18;
        if (audienceFilter === "family") return activity.minAge <= 5;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "popularity") {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return filtered;
  }, [allActivities, urlSearch, urlLocation, urlCategory, activityFilters, audienceFilter, priceRange, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [urlSearch, urlLocation, urlCategory, activityFilters, audienceFilter, priceRange, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }

      // Add pages around current
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex gap-8 px-4 py-8">
        {/* Filter Sidebar */}
        <aside className="hidden w-1/4 max-w-xs flex-col lg:flex">
          <div className="sticky top-24">
            <h2 className="text-[#2A4D3E] px-4 pb-3 pt-5 text-xl font-bold tracking-tight">
              Filtrar Atividades
            </h2>

            {/* Filters */}
            <div className="flex flex-col p-4">
              {/* Activity Type */}
              <details className="group flex flex-col border-t border-gray-300 py-2" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-bold text-[#2A4D3E]">Tipo de Atividade</p>
                  <ChevronDown className="h-5 w-5 text-[#2A4D3E] transition-transform group-open:rotate-180" />
                </summary>
                <div className="pt-2">
                  <label className="flex items-center gap-x-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activityFilters.nature}
                      onChange={(e) => setActivityFilters({ ...activityFilters, nature: e.target.checked })}
                      className="h-5 w-5 rounded border-2 border-gray-300 text-[#2A4D3E] focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-sm font-normal text-gray-700">Natureza</p>
                  </label>
                  <label className="flex items-center gap-x-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activityFilters.physical}
                      onChange={(e) => setActivityFilters({ ...activityFilters, physical: e.target.checked })}
                      className="h-5 w-5 rounded border-2 border-gray-300 text-[#2A4D3E] focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-sm font-normal text-gray-700">Física</p>
                  </label>
                  <label className="flex items-center gap-x-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activityFilters.artsCrafts}
                      onChange={(e) => setActivityFilters({ ...activityFilters, artsCrafts: e.target.checked })}
                      className="h-5 w-5 rounded border-2 border-gray-300 text-[#2A4D3E] focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-sm font-normal text-gray-700">Artes & Artesanato</p>
                  </label>
                </div>
              </details>

              {/* Audience */}
              <details className="group flex flex-col border-t border-gray-300 py-2" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-bold text-[#2A4D3E]">Público</p>
                  <ChevronDown className="h-5 w-5 text-[#2A4D3E] transition-transform group-open:rotate-180" />
                </summary>
                <div className="pt-2">
                  <label className="flex items-center gap-x-3 py-2 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="family"
                      checked={audienceFilter === "family"}
                      onChange={(e) => setAudienceFilter(e.target.value)}
                      className="h-5 w-5 border-2 border-gray-300 text-[#2A4D3E] focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-sm font-normal text-gray-700">Família</p>
                  </label>
                  <label className="flex items-center gap-x-3 py-2 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="kids"
                      checked={audienceFilter === "kids"}
                      onChange={(e) => setAudienceFilter(e.target.value)}
                      className="h-5 w-5 border-2 border-gray-300 text-[#2A4D3E] focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-sm font-normal text-gray-700">Apenas Crianças</p>
                  </label>
                  <label className="flex items-center gap-x-3 py-2 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="teens"
                      checked={audienceFilter === "teens"}
                      onChange={(e) => setAudienceFilter(e.target.value)}
                      className="h-5 w-5 border-2 border-gray-300 text-[#2A4D3E] focus:ring-0 focus:ring-offset-0"
                    />
                    <p className="text-sm font-normal text-gray-700">Adolescentes</p>
                  </label>
                </div>
              </details>

              {/* Price Range */}
              <details className="group flex flex-col border-t border-gray-300 py-2">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-sm font-bold text-[#2A4D3E]">Faixa de Preço</p>
                  <ChevronDown className="h-5 w-5 text-[#2A4D3E] transition-transform group-open:rotate-180" />
                </summary>
                <div className="pt-4 px-1">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#2A4D3E]"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>$0</span>
                    <span>${priceRange}{priceRange >= 500 ? '+' : ''}</span>
                  </div>
                </div>
              </details>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2 px-4">
              <Button
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-200"
                onClick={() => {
                  setActivityFilters({ nature: false, physical: false, artsCrafts: false });
                  setAudienceFilter("");
                  setPriceRange(500);
                }}
              >
                Limpar Todos os Filtros
              </Button>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          {/* Sort & View Controls */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg text-gray-700">
              {allActivities ? (
                <>Exibindo <strong>{filteredActivities.length}</strong> {filteredActivities.length === 1 ? 'resultado' : 'resultados'}{urlSearch && <> para "{urlSearch}"</>}</>
              ) : (
                'Carregando...'
              )}
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-[#2A4D3E] focus:outline-none focus:ring-1 focus:ring-[#2A4D3E]"
                >
                  <option value="popularity">Ordenar por Popularidade</option>
                  <option value="price">Ordenar por Preço</option>
                  <option value="rating">Ordenar por Avaliação</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              </div>
              <div className="hidden items-center gap-1 sm:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 ${
                    viewMode === "grid"
                      ? "bg-green-100 text-[#2A4D3E]"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 ${
                    viewMode === "list"
                      ? "bg-green-100 text-[#2A4D3E]"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {allActivities === undefined ? (
            <div className={`grid grid-cols-1 gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : ""}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white">
                  <div className="aspect-video w-full bg-gray-200 animate-pulse" />
                  <div className="flex flex-col p-4 gap-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className={`grid grid-cols-1 gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : ""}`}>
              {currentActivities.map((activity) => {
                const activityImage = activity.images && activity.images.length > 0
                  ? activity.images[0]
                  : "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop";

                return (
                  <Link
                    key={activity._id}
                    href={`/activities/${activity._id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="relative">
                      <div
                        className="aspect-video w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${activityImage}')` }}
                      />
                      <div className="absolute right-3 top-3 z-10 size-9">
                        <FavoriteButton activityId={activity._id} className="size-9 p-2" showToast />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-sm text-gray-600">{activity.location}</p>
                      <h4 className="mt-1 text-lg font-bold text-[#2A4D3E]">{activity.title}</h4>
                      <p className="mt-2 flex-grow text-sm text-gray-700">{activity.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#FFC72C] text-[#FFC72C]" />
                          <p className="text-sm font-medium text-gray-900">
                            {activity.rating || 0}{" "}
                            <span className="font-normal text-gray-600">({activity.reviewCount})</span>
                          </p>
                        </div>
                        <p className="text-lg font-bold text-[#2A4D3E]">
                          <span className="text-sm font-medium text-gray-700">A partir de</span> ${activity.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhuma atividade encontrada. Tente ajustar seus filtros.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex size-10 items-center justify-center rounded-lg ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                  return (
                    <span key={`ellipsis-${index}`} className="text-gray-700 px-2">
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#2A4D3E] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex size-10 items-center justify-center rounded-lg ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A9D8F]"></div></div>}>
      <ActivitiesPageContent />
    </Suspense>
  );
}
