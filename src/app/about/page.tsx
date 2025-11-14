import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/animations/fade-in"
import { TreePine, Heart, Users, Shield, Sparkles, Mountain } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a missão da movinature de conectar famílias com aventuras ao ar livre e ajudar crianças a descobrir a alegria da natureza.",
  openGraph: {
    title: "Sobre a movinature - Nossa Missão",
    description: "Conectando famílias com aventuras ao ar livre e ajudando crianças a descobrir a alegria da natureza.",
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
              Sobre a movinature
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Estamos em uma missão para reconectar famílias com a natureza, uma aventura de cada vez.
            </p>
          </div>
        </FadeIn>

        {/* Mission Statement */}
        <FadeIn delay={100}>
          <Card className="mb-16 shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Nossa Missão</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                Em um mundo cada vez mais digital, a movinature existe para ajudar famílias a descobrir o poder transformador
                das experiências ao ar livre. Conectamos crianças e famílias com atividades ao ar livre de alta qualidade e
                verificadas que promovem saúde física, bem-estar mental e um amor duradouro pela natureza.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Values Grid */}
        <div className="mb-16">
          <FadeIn delay={200}>
            <h2 className="text-4xl font-bold mb-12 text-center">Nossos Valores</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={300} direction="up">
              <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Segurança em Primeiro Lugar</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Todos os anfitriões são cuidadosamente verificados e as atividades atendem a rigorosos
                    padrões de segurança para garantir tranquilidade aos pais.
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
                  <h3 className="text-xl font-bold mb-3">Conexão com a Natureza</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Acreditamos que o tempo na natureza é essencial para o desenvolvimento saudável das
                    crianças e para a preservação ambiental.
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
                  <h3 className="text-xl font-bold mb-3">Vínculo Familiar</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Experiências ao ar livre compartilhadas criam memórias duradouras e fortalecem os laços
                    familiares de maneiras significativas.
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
                  <h3 className="text-xl font-bold mb-3">Experiências de Qualidade</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fazemos parceria com educadores e guias apaixonados que criam experiências ao ar livre
                    envolventes, educacionais e divertidas.
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
                  <h3 className="text-xl font-bold mb-3">Construção de Comunidade</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Promovemos uma comunidade acolhedora de famílias e entusiastas do ar livre que
                    compartilham nossos valores e paixão.
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
                  <h3 className="text-xl font-bold mb-3">Aventura e Crescimento</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Incentivamos as crianças a sair de suas zonas de conforto e construir confiança
                    através de desafios apropriados para cada idade.
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
              <h2 className="text-3xl font-bold mb-6 text-center">Nossa História</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                <p>
                  A movinature nasceu de uma simples observação: as crianças de hoje passam menos tempo ao ar livre do que
                  qualquer geração anterior. Como pais e entusiastas do ar livre, vimos em primeira mão
                  como as experiências na natureza podem ser transformadoras para o desenvolvimento, saúde e felicidade das crianças.
                </p>
                <p>
                  Também percebemos que encontrar atividades ao ar livre de qualidade, seguras e envolventes para crianças nem sempre
                  era fácil. Os pais queriam recomendações confiáveis, enquanto educadores e guias talentosos de atividades
                  ao ar livre lutavam para alcançar as famílias que mais se beneficiariam de seus programas.
                </p>
                <p>
                  Por isso criamos a movinature - uma plataforma que conecta famílias com provedores de atividades ao ar livre
                  verificados, facilitando a descoberta e reserva de aventuras que inspiram as crianças a
                  explorar, aprender e crescer na natureza.
                </p>
                <p className="font-semibold text-gray-900">
                  Hoje, temos orgulho de fazer parceria com anfitriões apaixonados em todo o país que compartilham nossa missão
                  de ajudar a próxima geração a desenvolver uma conexão duradoura com o mundo natural.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={1000}>
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Junte-se à Nossa Comunidade</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Seja você um pai procurando aventuras ao ar livre ou um guia querendo compartilhar sua paixão,
              adoraríamos tê-lo na família movinature.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
