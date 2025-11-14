import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Book } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-[#2A9D8F] hover:text-[#2A9D8F]/80 text-sm font-medium mb-4 inline-block">
            ← Voltar para Início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Central de Ajuda</h1>
          <p className="text-gray-600">Encontre respostas para perguntas comuns e obtenha suporte</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Mail className="h-12 w-12 text-[#2A9D8F] mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Suporte por E-mail</h3>
            <p className="text-gray-600 text-sm mb-4">Obtenha ajuda via e-mail</p>
            <a href="mailto:support@kidventures.com" className="text-[#2A9D8F] hover:underline">
              support@kidventures.com
            </a>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <MessageCircle className="h-12 w-12 text-[#2A9D8F] mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Chat ao Vivo</h3>
            <p className="text-gray-600 text-sm mb-4">Converse com nossa equipe</p>
            <Button className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90">Iniciar Chat</Button>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Book className="h-12 w-12 text-[#2A9D8F] mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Base de Conhecimento</h3>
            <p className="text-gray-600 text-sm mb-4">Navegue pelos artigos de ajuda</p>
            <Button variant="outline">Ver Artigos</Button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Como faço para reservar uma atividade?</h3>
              <p className="text-gray-700">Navegue pelas atividades, selecione sua data e horário preferidos e conclua o processo de reserva com o pagamento.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Qual é a política de cancelamento?</h3>
              <p className="text-gray-700">As políticas de cancelamento variam por atividade. Por favor, verifique a política específica na página de cada atividade antes de reservar.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Como me torno um anfitrião?</h3>
              <p className="text-gray-700">Clique em "Tornar-se um Anfitrião" no cabeçalho, crie seu perfil e liste sua primeira atividade. Nossa equipe irá revisar e aprovar sua listagem.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">As atividades são seguras para crianças?</h3>
              <p className="text-gray-700">Todos os anfitriões são verificados e as atividades incluem informações de segurança. No entanto, os pais devem revisar os detalhes da atividade e usar seu próprio julgamento.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90">
            <Link href="/">Voltar para Página Inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
