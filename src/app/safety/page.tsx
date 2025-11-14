import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, AlertCircle } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-[#2A9D8F] hover:text-[#2A9D8F]/80 text-sm font-medium mb-4 inline-block">
            ← Voltar ao Início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Confiança & Segurança</h1>
          <p className="text-gray-600">A segurança da sua família é nossa principal prioridade</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <Shield className="h-12 w-12 text-[#2A9D8F] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Anfitriões Verificados</h3>
            <p className="text-sm text-gray-600">Todos os anfitriões passam por verificação de antecedentes</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <UserCheck className="h-12 w-12 text-[#2A9D8F] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Atividades Avaliadas</h3>
            <p className="text-sm text-gray-600">Leia avaliações de outras famílias antes de reservar</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-[#2A9D8F] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Suporte 24/7</h3>
            <p className="text-sm text-gray-600">Nossa equipe está sempre aqui para ajudar</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Diretrizes de Segurança</h2>
            <ul className="space-y-3 text-gray-700">
              <li>• Sempre revise as descrições das atividades e requisitos de idade cuidadosamente</li>
              <li>• Leia as informações de segurança fornecidas pelos anfitriões antes de participar</li>
              <li>• Comunique quaisquer necessidades especiais ou preocupações com seu anfitrião antecipadamente</li>
              <li>• Certifique-se de que as crianças estejam supervisionadas de acordo com os requisitos da atividade</li>
              <li>• Relate quaisquer preocupações de segurança imediatamente à nossa equipe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Requisitos para Anfitriões</h2>
            <p className="text-gray-700 mb-3">Todos os anfitriões em nossa plataforma devem:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Completar verificação de identidade</li>
              <li>• Passar por verificação de antecedentes</li>
              <li>• Fornecer comprovante de certificações ou licenças relevantes</li>
              <li>• Possuir seguro de responsabilidade civil apropriado</li>
              <li>• Seguir nossos padrões de segurança e qualidade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Relatar um Problema de Segurança</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver preocupações sobre uma atividade ou anfitrião, entre em contato conosco imediatamente.
            </p>
            <Button className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90">
              Relatar um Problema
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
