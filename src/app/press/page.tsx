import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-[#2A9D8F] hover:text-[#2A9D8F]/80 text-sm font-medium mb-4 inline-block">
            ← Voltar ao Início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Imprensa & Mídia</h1>
          <p className="text-gray-600">Notícias, comunicados de imprensa e recursos de mídia</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4">Sobre a movinature</h2>
          <p className="text-gray-700 leading-relaxed">
            movinature é uma plataforma líder que conecta famílias com atividades únicas ao ar livre e físicas
            para crianças de todas as idades. Nossa missão é tornar o tempo de qualidade em família acessível, memorável e divertido.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4">Contato para Imprensa</h2>
          <p className="text-gray-700">Para consultas da mídia, entre em contato:</p>
          <p className="text-gray-900 font-medium mt-2">press@kidventures.com</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Kit de Mídia</h2>
          <p className="text-gray-700 mb-4">Baixe nosso logotipo, ativos de marca e informações da empresa.</p>
          <Button className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90">
            Baixar Kit de Mídia
          </Button>
        </div>
      </div>
    </div>
  );
}
