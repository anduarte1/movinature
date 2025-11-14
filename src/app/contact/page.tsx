import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <Link href="/" className="text-[#2A9D8F] hover:text-[#2A9D8F]/80 text-sm font-medium mb-4 inline-block">
            ← Voltar para Início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fale Conosco</h1>
          <p className="text-gray-600">Entre em contato com nossa equipe</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                placeholder="Sobre o que é?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                placeholder="Conte-nos mais..."
              />
            </div>
            <Button className="w-full bg-[#2A9D8F] hover:bg-[#2A9D8F]/90">
              Enviar Mensagem
            </Button>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Outras formas de nos contatar</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>E-mail:</strong> support@kidventures.com</p>
            <p><strong>Telefone:</strong> 1-800-KIDVENTURES</p>
            <p><strong>Endereço:</strong> 123 Adventure Lane, San Francisco, CA 94102</p>
          </div>
        </div>
      </div>
    </div>
  );
}
