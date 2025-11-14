import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-[#2A9D8F] hover:text-[#2A9D8F]/80 text-sm font-medium mb-4 inline-block"
          >
            ← Voltar para Início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-gray-600">Última atualização: Novembro de 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Coletamos informações para fornecer melhores serviços aos nossos usuários. Os tipos de
              informações que coletamos incluem:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Informações pessoais (nome, endereço de e-mail, número de telefone)</li>
              <li>Informações de pagamento para reserva de atividades</li>
              <li>Informações de perfil incluindo preferências e interesses</li>
              <li>Dados de uso e interação com nossa plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Usamos as informações que coletamos para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Processar e gerenciar suas reservas</li>
              <li>Enviar confirmações e atualizações de reservas</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Comunicar com você sobre atividades e promoções</li>
              <li>Garantir segurança e prevenir fraudes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-gray-700 leading-relaxed">
              Não vendemos suas informações pessoais. Podemos compartilhar suas informações com anfitriões de
              atividades para facilitar reservas, e com prestadores de serviços que nos auxiliam na operação
              de nossa plataforma. Todos os terceiros são obrigados a manter a confidencialidade de suas
              informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra
              acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de
              transmissão pela Internet é 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Acessar e atualizar suas informações pessoais</li>
              <li>Solicitar exclusão de sua conta e dados</li>
              <li>Cancelar o recebimento de comunicações de marketing</li>
              <li>Solicitar uma cópia de seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso e
              entregar conteúdo personalizado. Você pode controlar as configurações de cookies através das
              preferências do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacidade de Crianças</h2>
            <p className="text-gray-700 leading-relaxed">
              Embora nossa plataforma ajude famílias a encontrar atividades para crianças, os usuários devem ter 18 anos
              ou mais para criar uma conta e fazer reservas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Fale Conosco</h2>
            <p className="text-gray-700 leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em
              privacy@kidventures.com
            </p>
          </section>
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
