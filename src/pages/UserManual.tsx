import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ExportPdfButton } from '@/components/ExportPdfButton';
import { BookOpen, LayoutDashboard, Users, ClipboardList, Map, Upload, BarChart3, Brain, Shield, HelpCircle } from 'lucide-react';

const sections = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard CockPit',
    content: `O Dashboard CockPit é o painel principal do sistema, oferecendo visão geral da operação em tempo real.

**Indicadores Principais:**
- **Presença Real**: Gráfico de rosca mostrando técnicos presentes vs. planejado
- **Capacidade Produtiva**: Horas disponíveis vs. planejadas
- **Produtividade Real**: Média de OS por técnico

**KPIs Operacionais:**
- Total de técnicos, disponíveis, em atendimento e offline
- Total de OS, pendentes, em progresso e concluídas
- Gráficos de barras por tipo de serviço e prioridade
- Distribuição de OS em gráfico de rosca

**Como usar:** Acesse o menu lateral > Dashboard para visualizar todos os indicadores em tempo real.`,
  },
  {
    icon: Users,
    title: 'Gestão de Técnicos',
    content: `Gerencie sua equipe de técnicos de campo com informações completas.

**Funcionalidades:**
- Cadastro de técnicos com nome, matrícula, telefone e email
- Status em tempo real: Disponível, Ocupado ou Offline
- Localização geográfica com coordenadas
- Endereço atual do técnico

**Como cadastrar:**
1. Acesse Dashboard > Técnicos
2. Clique em "Novo Técnico"
3. Preencha os dados obrigatórios
4. Clique em "Salvar"

**Status dos Técnicos:**
- 🟢 **Disponível** — Pronto para receber OS
- 🟡 **Ocupado** — Em atendimento
- 🔴 **Offline** — Indisponível`,
  },
  {
    icon: ClipboardList,
    title: 'Ordens de Serviço',
    content: `Gerenciamento completo do ciclo de vida das Ordens de Serviço.

**Tipos de Serviço:**
- Instalação — Novas ativações FTTH
- Manutenção — Preventiva e corretiva
- Reparo — Correção de falhas

**Prioridades:**
- Normal — Atendimento padrão
- Alta — Atenção prioritária
- Urgente — Atendimento imediato

**Fluxo da OS:**
1. **Pendente** → OS criada, aguardando atribuição
2. **Atribuída** → Técnico designado
3. **Em Progresso** → Técnico em atendimento
4. **Concluída** → Serviço finalizado
5. **Cancelada** → OS cancelada

**Filtros disponíveis:** Busca por número, status, tipo de serviço e prioridade.`,
  },
  {
    icon: Map,
    title: 'Mapa de Deslocamento',
    content: `Visualize a localização dos técnicos e ordens de serviço no mapa.

**Recursos:**
- Posição dos técnicos em tempo real
- Localização das OS pendentes e em andamento
- Linhas de deslocamento entre base e OS
- Informações do técnico ao passar o mouse

**Legenda:**
- 📍 Marcadores coloridos por status do técnico
- 📋 Marcadores de OS por prioridade
- 📏 Linhas de deslocamento com distância estimada`,
  },
  {
    icon: Upload,
    title: 'Registros Diários',
    content: `Importe dados em massa para alimentar o sistema.

**Formatos aceitos:**
- Excel (.xlsx, .xls)
- CSV (.csv)

**Colunas esperadas no arquivo:**
| Coluna | Descrição |
|--------|-----------|
| Nome / Tecnico | Nome do técnico |
| Matricula / MAT | Matrícula do técnico |
| Data | Data do registro (YYYY-MM-DD) |
| OS / Total_OS | Total de OS |
| Concluidas | OS concluídas |
| Pendentes | OS pendentes |
| TMA | Tempo médio de atendimento |
| Status | Status do técnico |

**Como importar:**
1. Acesse Dashboard > Registros Diários
2. Clique em "Selecionar Arquivo"
3. Escolha seu arquivo .xlsx ou .csv
4. Revise os dados na tabela
5. Clique em "Salvar Dados"

**Dica:** Você pode adicionar linhas manualmente ou editar os dados importados antes de salvar.`,
  },
  {
    icon: BarChart3,
    title: 'Exportação de Relatórios (PDF)',
    content: `Exporte os relatórios de qualquer página em formato PDF.

**Como exportar:**
1. Navegue até a página desejada
2. Clique no botão "Exportar PDF" no canto superior direito
3. Aguarde a geração do arquivo
4. O PDF será baixado automaticamente

**Páginas com exportação:**
- Dashboard CockPit
- Técnicos
- Ordens de Serviço
- Mapa
- Registros Diários
- Qualidade dos Indicadores

**Formato:** A4, orientação retrato, com todos os gráficos e tabelas visíveis.`,
  },
  {
    icon: Brain,
    title: 'Qualidade dos Indicadores',
    content: `Ferramentas de qualidade para análise e melhoria contínua dos indicadores.

**Ferramentas Disponíveis:**

**1. PDCA (Plan-Do-Check-Act)**
Ciclo de melhoria contínua com 4 fases:
- P (Planejar) — Identificar problemas e planejar ações
- D (Fazer) — Executar as ações planejadas
- C (Verificar) — Conferir resultados obtidos
- A (Agir) — Padronizar ou corrigir

**2. Matriz GUT (Gravidade, Urgência, Tendência)**
Priorize problemas com pontuação de 1 a 5:
- G = Gravidade do impacto
- U = Urgência para resolver
- T = Tendência de piora
- Resultado = G × U × T

**3. FCA (Fato, Causa, Ação)**
Análise estruturada de problemas com ações corretivas.

**4. Brainstorm**
Sessão de geração e votação de ideias para resolução de problemas.

**5. Plano de Ação 5W2H**
Plano detalhado: O quê, Por quê, Onde, Quando, Quem, Como e Quanto custa.

**6. IA Assistente**
Assistente inteligente para análise de indicadores, sugestões de melhoria e geração de planos de ação.`,
  },
  {
    icon: Shield,
    title: 'Segurança e Permissões',
    content: `O sistema utiliza controle de acesso baseado em funções (RBAC).

**Níveis de Acesso:**
- **Admin** — Acesso total ao sistema, gestão de usuários e configurações
- **Supervisor** — Visualização de todos os dados, gestão de técnicos e OS
- **Técnico** — Acesso restrito às suas OS e atualização de status

**Segurança:**
- Autenticação por email e senha
- Sessões seguras com tokens JWT
- Políticas de segurança no banco de dados (RLS)
- Criptografia de dados em trânsito (HTTPS)`,
  },
];

export default function UserManual() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Manual de Utilização</h1>
          <p className="text-muted-foreground">Guia completo de uso do FTTH Monitor</p>
        </div>
        <ExportPdfButton targetId="manual-content" fileName="manual_usuario" />
      </div>

      <div id="manual-content" className="space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">Bem-vindo ao FTTH Monitor</h2>
            <p className="text-muted-foreground">
              O FTTH Monitor é uma plataforma completa de Planejamento e Controle da Produção (PCP) para operações de fibra óptica. 
              Este manual cobre todas as funcionalidades do sistema para ajudá-lo a maximizar a produtividade da sua equipe.
            </p>
            <div className="flex gap-2 mt-4">
              <Badge className="bg-primary/20 text-primary">v1.0</Badge>
              <Badge variant="outline">Abril 2026</Badge>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-2">
          {sections.map((section, i) => (
            <AccordionItem key={i} value={`section-${i}`} className="border border-border/50 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed pb-4">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="border-border/50">
          <CardContent className="p-6 text-center">
            <HelpCircle className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
            <p className="text-sm text-muted-foreground">
              Use o Assistente IA na página de Qualidade dos Indicadores para obter respostas instantâneas sobre o sistema e melhoria de indicadores.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
