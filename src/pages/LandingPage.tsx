import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Wifi, 
  BarChart3, 
  MapPin, 
  Users, 
  ClipboardList, 
  Shield, 
  Zap, 
  TrendingUp,
  ChevronRight,
  Activity
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard CockPit',
    description: 'Painel de controle em tempo real com KPIs de produtividade, presença e capacidade operacional.',
  },
  {
    icon: Users,
    title: 'Gestão de Técnicos',
    description: 'Controle completo de equipes de campo com status em tempo real, matrícula e localização.',
  },
  {
    icon: ClipboardList,
    title: 'Ordens de Serviço',
    description: 'Gerenciamento de OS com fluxo completo: instalação, manutenção e reparo com prioridades.',
  },
  {
    icon: MapPin,
    title: 'Mapa de Deslocamento',
    description: 'Visualização geográfica dos técnicos em campo com rastreamento de deslocamentos.',
  },
  {
    icon: TrendingUp,
    title: 'Métricas & Indicadores',
    description: 'Análise de eficiência, taxa de conclusão, produtividade por técnico e metas vs. realizado.',
  },
  {
    icon: Shield,
    title: 'Segurança & RBAC',
    description: 'Controle de acesso baseado em funções: Admin, Supervisor e Técnico com RLS no banco.',
  },
];

const stats = [
  { value: '99.7%', label: 'Uptime', icon: Zap },
  { value: '15+', label: 'Técnicos', icon: Users },
  { value: '500+', label: 'OS/mês', icon: ClipboardList },
  { value: '< 2h', label: 'Tempo Médio', icon: Activity },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Wifi className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">FTTH Monitor</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary">
                Começar Agora
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Planejamento e Controle da Produção
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Monitore sua equipe{' '}
            <span className="text-gradient">FTTH</span>{' '}
            em tempo real
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Sistema completo de gestão de técnicos de campo para operações de fibra óptica. 
            Dashboard CockPit, ordens de serviço, mapa de deslocamento e métricas de produtividade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-lg px-8 w-full sm:w-auto">
                Acessar Plataforma
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 w-full sm:w-auto">
                Conhecer Recursos
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold font-mono text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para{' '}
              <span className="text-gradient">gerenciar</span>{' '}
              operações FTTH
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Plataforma integrada inspirada em relatórios PBI para máxima visibilidade operacional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Wifi className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Pronto para otimizar suas operações?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Acesse o dashboard CockPit e tenha controle total sobre técnicos, ordens de serviço e métricas de produtividade.
              </p>
              <Link to="/auth">
                <Button size="lg" className="gradient-primary text-lg px-10">
                  Começar Agora
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            <span className="font-semibold">FTTH Monitor</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FTTH Monitor — Planejamento e Controle da Produção. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
