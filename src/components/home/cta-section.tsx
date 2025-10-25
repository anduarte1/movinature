"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-24">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black,transparent)]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <FadeIn delay={100}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Adventure?
          </h2>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Join thousands of families discovering nature together. Book your perfect outdoor experience today.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all bg-white text-green-600 hover:bg-gray-50 hover:scale-105"
              asChild
            >
              <Link href="/activities">Browse Activities</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-xl border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
