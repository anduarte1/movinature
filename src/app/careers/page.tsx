import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-[#2A9D8F] hover:text-[#2A9D8F]/80 text-sm font-medium mb-4 inline-block">
            ← Voltar ao Início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Carreiras na movinature</h1>
          <p className="text-gray-600">Junte-se à nossa equipe e ajude famílias a criar memórias incríveis</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4">Por Que Trabalhar Conosco?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Na movinature, somos apaixonados por conectar famílias com experiências incríveis ao ar livre.
            Junte-se à nossa equipe para causar um impacto real em como as famílias passam tempo de qualidade juntas.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Trabalho Flexível</h3>
              <p className="text-sm text-gray-600">Cultura remota em primeiro lugar</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Ótimos Benefícios</h3>
              <p className="text-sm text-gray-600">Saúde, dental e visão</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Crescimento</h3>
              <p className="text-sm text-gray-600">Oportunidades de aprendizado</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Vagas Abertas</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg">Full Stack Engineer</h3>
              <p className="text-gray-600 mb-3">San Francisco, CA (Remote) • Full-time</p>
              <p className="text-gray-700">Help build the platform that connects families with amazing experiences.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg">Product Designer</h3>
              <p className="text-gray-600 mb-3">Remote • Full-time</p>
              <p className="text-gray-700">Design delightful experiences for families discovering activities.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg">Customer Success Manager</h3>
              <p className="text-gray-600 mb-3">Remote • Full-time</p>
              <p className="text-gray-700">Support our community of hosts and families.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Não encontrou a vaga perfeita? Ainda gostaríamos de ouvir de você!</p>
          <Button className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90">
            Enviar Seu Currículo
          </Button>
        </div>
      </div>
    </div>
  );
}
