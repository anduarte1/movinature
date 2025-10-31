import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/animations/fade-in"
import { TreePine, Heart, Users, Shield, Sparkles, Mountain } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about movinature's mission to connect families with outdoor adventures and help kids discover the joy of nature.",
  openGraph: {
    title: "About movinature - Our Mission",
    description: "Connecting families with outdoor adventures and helping kids discover the joy of nature.",
    url: "https://movinature.com/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6">
              <TreePine className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              About movinature
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to reconnect families with the great outdoors, one adventure at a time.
            </p>
          </div>
        </FadeIn>

        {/* Mission Statement */}
        <FadeIn delay={100}>
          <Card className="mb-16 shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                In an increasingly digital world, movinature exists to help families discover the transformative power
                of outdoor experiences. We connect kids and families with vetted, high-quality outdoor activities
                and adventures that promote physical health, mental well-being, and a lifelong love of nature.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Values Grid */}
        <div className="mb-16">
          <FadeIn delay={200}>
            <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={300} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Safety First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All hosts are carefully vetted and activities meet strict safety standards to ensure
                    peace of mind for parents.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={400} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                    <TreePine className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Nature Connection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe that time in nature is essential for healthy child development and
                    environmental stewardship.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={500} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Family Bonding</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Shared outdoor experiences create lasting memories and strengthen family connections
                    in meaningful ways.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={600} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Quality Experiences</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We partner with passionate educators and guides who create engaging, educational,
                    and fun outdoor experiences.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={700} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Community Building</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We foster a supportive community of families and outdoor enthusiasts who share
                    our values and passion.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={800} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                    <Mountain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Adventure & Growth</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We encourage kids to step outside their comfort zones and build confidence through
                    age-appropriate challenges.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>

        {/* Story Section */}
        <FadeIn delay={900}>
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                <p>
                  movinature was born from a simple observation: kids today spend less time outdoors than
                  any previous generation. As parents and outdoor enthusiasts ourselves, we saw firsthand
                  how transformative nature experiences could be for children's development, health, and happiness.
                </p>
                <p>
                  We also noticed that finding quality, safe, and engaging outdoor activities for kids wasn't
                  always easy. Parents wanted trusted recommendations, while talented outdoor educators and
                  guides struggled to reach families who would benefit most from their programs.
                </p>
                <p>
                  That's why we created movinature - a platform that connects families with vetted outdoor
                  activity providers, making it easy to discover and book adventures that inspire kids to
                  explore, learn, and grow in nature.
                </p>
                <p className="font-semibold text-gray-900">
                  Today, we're proud to partner with passionate hosts across the country who share our mission
                  of helping the next generation develop a lifelong connection with the natural world.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={1000}>
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a parent looking for outdoor adventures or a guide wanting to share your passion,
              we'd love to have you join the movinature family.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
