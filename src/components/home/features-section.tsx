"use client"

import { TreePine, Sparkles, Heart } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

const features = [
  {
    icon: TreePine,
    title: "Nature Activities",
    description: "Hiking, camping, nature walks and outdoor adventures in beautiful natural settings",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-100 hover:border-green-300",
    shadowColor: "shadow-green-200/50",
  },
  {
    icon: Sparkles,
    title: "Physical Activities",
    description: "Sports, climbing, swimming and active play for all ages and skill levels",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-100 hover:border-blue-300",
    shadowColor: "shadow-blue-200/50",
  },
  {
    icon: Heart,
    title: "Family Friendly",
    description: "Safe, vetted activities perfect for creating lasting family memories",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-100 hover:border-purple-300",
    shadowColor: "shadow-purple-200/50",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 150} direction="up">
              <div className={`group relative bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl border ${feature.borderColor} hover:shadow-xl transition-all duration-300 cursor-default h-full`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300`}></div>

                <div className="relative">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
