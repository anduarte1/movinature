import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Termos de Serviço</h1>
          <p className="text-gray-600">Última atualização: Novembro de 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar a movinature, você aceita e concorda em estar vinculado aos termos e
              provisões deste acordo. Se você não concordar em cumprir o acima exposto, por favor não
              use este serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Licença de Uso</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              É concedida permissão para baixar temporariamente uma cópia dos materiais da movinature
              apenas para visualização pessoal e não comercial transitória. Esta é a concessão de uma licença,
              não uma transferência de título, e sob esta licença você não pode:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Modificar ou copiar os materiais</li>
              <li>Usar os materiais para qualquer propósito comercial ou exibição pública</li>
              <li>Tentar fazer engenharia reversa de qualquer software contido na movinature</li>
              <li>Remover quaisquer direitos autorais ou outras notações proprietárias dos materiais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Reservas de Atividades</h2>
            <p className="text-gray-700 leading-relaxed">
              Todas as reservas de atividades estão sujeitas a disponibilidade e confirmação. A movinature atua
              como um marketplace conectando famílias com anfitriões de atividades. Não somos responsáveis pela
              qualidade ou segurança de atividades listadas por anfitriões terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades do Usuário</h2>
            <p className="text-gray-700 leading-relaxed">
              Os usuários são responsáveis por manter a confidencialidade das informações de suas contas
              e por todas as atividades que ocorram sob suas contas. Você concorda em nos notificar imediatamente
              sobre qualquer uso não autorizado de sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Política de Cancelamento</h2>
            <p className="text-gray-700 leading-relaxed">
              As políticas de cancelamento variam por atividade e são definidas por anfitriões individuais. Por favor, revise
              a política de cancelamento antes de reservar. Reembolsos, se aplicável, serão processados
              de acordo com a política declarada pelo anfitrião.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              A movinature não será responsável por quaisquer danos decorrentes do uso ou incapacidade de
              usar nosso serviço, incluindo mas não limitado a lesões sofridas durante as atividades.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Informações de Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em legal@kidventures.com
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
