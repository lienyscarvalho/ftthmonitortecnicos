import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ExportPdfButton } from '@/components/ExportPdfButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Send, Loader2, Plus, Trash2, RotateCcw, CheckCircle2, AlertTriangle, Target, TrendingUp, Lightbulb, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Types
interface PdcaItem { id: string; phase: 'P' | 'D' | 'C' | 'A'; action: string; responsible: string; deadline: string; status: string; }
interface GutItem { id: string; problem: string; gravity: number; urgency: number; trend: number; total: number; priority: string; }
interface FcaItem { id: string; fact: string; cause: string; action: string; responsible: string; deadline: string; }
interface BrainstormIdea { id: string; idea: string; category: string; votes: number; }
interface ActionPlanItem { id: string; what: string; why: string; where: string; when: string; who: string; how: string; howMuch: string; status: string; }
interface AiMessage { role: 'user' | 'assistant'; content: string; }

export default function QualityIndicators() {
  // PDCA
  const [pdcaItems, setPdcaItems] = useState<PdcaItem[]>([
    { id: '1', phase: 'P', action: 'Mapear causas de retrabalho > 5%', responsible: 'Coord. Qualidade', deadline: '2026-04-15', status: 'Em andamento' },
    { id: '2', phase: 'D', action: 'Implementar checklist digital obrigatório', responsible: 'TI / Campo', deadline: '2026-04-20', status: 'Pendente' },
    { id: '3', phase: 'C', action: 'Auditar 10% das OS diariamente', responsible: 'Supervisor', deadline: '2026-04-30', status: 'Pendente' },
    { id: '4', phase: 'A', action: 'Padronizar procedimento corrigido', responsible: 'Engenharia', deadline: '2026-05-10', status: 'Pendente' },
  ]);

  // GUT
  const [gutItems, setGutItems] = useState<GutItem[]>([
    { id: '1', problem: 'Retrabalho acima da meta (6% vs 5%)', gravity: 5, urgency: 5, trend: 4, total: 100, priority: 'Crítico' },
    { id: '2', problem: 'TMA acima da meta (4h12 vs 4h)', gravity: 4, urgency: 4, trend: 3, total: 48, priority: 'Alto' },
    { id: '3', problem: 'Agendamento abaixo da meta (88% vs 90%)', gravity: 3, urgency: 4, trend: 3, total: 36, priority: 'Médio' },
    { id: '4', problem: 'Custo de retrabalho elevado (R$84K vs R$70K)', gravity: 5, urgency: 4, trend: 4, total: 80, priority: 'Crítico' },
  ]);

  // FCA
  const [fcaItems, setFcaItems] = useState<FcaItem[]>([
    { id: '1', fact: 'Retrabalho em 6% das OS', cause: 'Falta de checklist no encerramento', action: 'Implementar checklist digital obrigatório', responsible: 'TI', deadline: '2026-04-20' },
    { id: '2', fact: 'TMA 12min acima da meta', cause: 'Deslocamento excessivo entre OS', action: 'Otimizar roteirização com base geográfica', responsible: 'Planejamento', deadline: '2026-04-25' },
  ]);

  // Brainstorm
  const [brainstormIdeas, setBrainstormIdeas] = useState<BrainstormIdea[]>([
    { id: '1', idea: 'Checklist digital obrigatório no encerramento de OS', category: 'Alto Impacto', votes: 15 },
    { id: '2', idea: 'Teste OTDR obrigatório após emenda + foto', category: 'Alto Impacto', votes: 13 },
    { id: '3', idea: 'Programa de mentoria técnico sênior/júnior', category: 'Médio Prazo', votes: 11 },
    { id: '4', idea: 'Gamificação: ranking semanal de qualidade', category: 'Fácil Impl.', votes: 9 },
    { id: '5', idea: 'Manutenção preventiva mensal de fusionadoras', category: 'Tecnologia', votes: 8 },
  ]);
  const [newIdea, setNewIdea] = useState('');
  const [brainstormTheme, setBrainstormTheme] = useState('Como reduzir Retrabalho de 6% para <=5%?');

  // 5W2H Action Plan
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>([
    { id: '1', what: 'Implantar checklist digital', why: 'Reduzir retrabalho de 6% para 5%', where: 'Todas as bases SP', when: '2026-04-20', who: 'TI + Campo', how: 'App de campo com validação obrigatória', howMuch: 'R$ 15.000', status: 'Em andamento' },
    { id: '2', what: 'Treinamento relâmpago semanal', why: 'Reduzir erros técnicos recorrentes', where: 'Base operacional', when: '2026-04-14', who: 'Supervisor', how: 'Sessões de 30min toda segunda', howMuch: 'R$ 0 (interno)', status: 'Concluído' },
  ]);

  // AI Chat
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente de **Qualidade e Melhoria Contínua**. Posso ajudá-lo com:\n\n- Análise de indicadores (Retrabalho, TMA, Agendamento)\n- Sugestões de ações PDCA\n- Priorização GUT de problemas\n- Geração de planos de ação 5W2H\n- Brainstorm de ideias para melhoria\n\nComo posso ajudar?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg: AiMessage = { role: 'user', content: aiInput };
    const allMessages = [...aiMessages, userMsg];
    setAiMessages(allMessages);
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await supabase.functions.invoke('quality-ai', {
        body: { messages: allMessages.map(m => ({ role: m.role, content: m.content })) },
      });

      if (response.error) throw response.error;
      const data = response.data;
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Desculpe, não consegui processar sua solicitação.' }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar com o assistente. Tente novamente.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const addBrainstormIdea = () => {
    if (!newIdea.trim()) return;
    setBrainstormIdeas(prev => [...prev, { id: `${Date.now()}`, idea: newIdea, category: 'Nova', votes: 0 }]);
    setNewIdea('');
  };

  const voteIdea = (id: string) => {
    setBrainstormIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i).sort((a, b) => b.votes - a.votes));
  };

  const phaseColor = (p: string) => {
    const map: Record<string, string> = { P: 'bg-blue-500/20 text-blue-400', D: 'bg-primary/20 text-primary', C: 'bg-success/20 text-green-400', A: 'bg-accent/20 text-orange-400' };
    return map[p] || '';
  };

  const gutPriorityColor = (p: string) => {
    const map: Record<string, string> = { 'Crítico': 'bg-destructive/20 text-red-400', 'Alto': 'bg-warning/20 text-yellow-400', 'Médio': 'bg-blue-500/20 text-blue-400', 'Baixo': 'bg-success/20 text-green-400' };
    return map[p] || '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Qualidade dos Indicadores</h1>
          <p className="text-muted-foreground">Ferramentas de qualidade para melhoria contínua</p>
        </div>
        <ExportPdfButton targetId="quality-content" fileName="qualidade_indicadores" />
      </div>

      <div id="quality-content">
        <Tabs defaultValue="pdca" className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="pdca"><RotateCcw className="h-3 w-3 mr-1" />PDCA</TabsTrigger>
            <TabsTrigger value="gut"><Target className="h-3 w-3 mr-1" />GUT</TabsTrigger>
            <TabsTrigger value="fca"><AlertTriangle className="h-3 w-3 mr-1" />FCA</TabsTrigger>
            <TabsTrigger value="brainstorm"><Lightbulb className="h-3 w-3 mr-1" />Brainstorm</TabsTrigger>
            <TabsTrigger value="5w2h"><CheckCircle2 className="h-3 w-3 mr-1" />5W2H</TabsTrigger>
            <TabsTrigger value="ai"><Brain className="h-3 w-3 mr-1" />IA Assistente</TabsTrigger>
          </TabsList>

          {/* PDCA */}
          <TabsContent value="pdca" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-primary font-mono">Ciclo PDCA — Melhoria Contínua</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {['P', 'D', 'C', 'A'].map(phase => (
                    <Card key={phase} className="border-border/50">
                      <CardContent className="p-4 text-center">
                        <Badge className={phaseColor(phase)}>{phase}</Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {phase === 'P' ? 'Plan — Planejar' : phase === 'D' ? 'Do — Executar' : phase === 'C' ? 'Check — Verificar' : 'Act — Agir'}
                        </p>
                        <p className="text-2xl font-bold font-mono mt-1">{pdcaItems.filter(i => i.phase === phase).length}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fase</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pdcaItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell><Badge className={phaseColor(item.phase)}>{item.phase}</Badge></TableCell>
                        <TableCell className="text-sm">{item.action}</TableCell>
                        <TableCell className="text-sm">{item.responsible}</TableCell>
                        <TableCell className="text-sm font-mono">{item.deadline}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GUT */}
          <TabsContent value="gut" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-primary font-mono">Matriz GUT — Priorização de Problemas</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Problema</TableHead>
                      <TableHead className="text-center">G</TableHead>
                      <TableHead className="text-center">U</TableHead>
                      <TableHead className="text-center">T</TableHead>
                      <TableHead className="text-center">GxUxT</TableHead>
                      <TableHead>Prioridade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gutItems.sort((a, b) => b.total - a.total).map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="text-sm">{item.problem}</TableCell>
                        <TableCell className="text-center font-mono">{item.gravity}</TableCell>
                        <TableCell className="text-center font-mono">{item.urgency}</TableCell>
                        <TableCell className="text-center font-mono">{item.trend}</TableCell>
                        <TableCell className="text-center font-mono font-bold">{item.total}</TableCell>
                        <TableCell><Badge className={gutPriorityColor(item.priority)}>{item.priority}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FCA */}
          <TabsContent value="fca" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-primary font-mono">FCA — Fato, Causa e Ação</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fato</TableHead>
                      <TableHead>Causa</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Prazo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fcaItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="text-sm">{item.fact}</TableCell>
                        <TableCell className="text-sm">{item.cause}</TableCell>
                        <TableCell className="text-sm">{item.action}</TableCell>
                        <TableCell className="text-sm">{item.responsible}</TableCell>
                        <TableCell className="text-sm font-mono">{item.deadline}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brainstorm */}
          <TabsContent value="brainstorm" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-primary font-mono">Brainstorm — Geração e Seleção de Ideias</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Tema: <span className="text-primary font-semibold">{brainstormTheme}</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={newIdea} onChange={e => setNewIdea(e.target.value)} placeholder="Digite uma nova ideia..." onKeyDown={e => e.key === 'Enter' && addBrainstormIdea()} />
                  <Button onClick={addBrainstormIdea} className="gradient-primary"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                  {brainstormIdeas.map((idea, i) => (
                    <div key={idea.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-lg font-bold font-mono text-primary w-8">{i + 1}°</span>
                      <div className="flex-1">
                        <p className="text-sm">{idea.idea}</p>
                        <Badge variant="outline" className="text-[10px] mt-1">{idea.category}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => voteIdea(idea.id)}>
                        👍 {idea.votes}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5W2H */}
          <TabsContent value="5w2h" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-primary font-mono">Plano de Ação 5W2H</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>O quê (What)</TableHead>
                        <TableHead>Por quê (Why)</TableHead>
                        <TableHead>Onde (Where)</TableHead>
                        <TableHead>Quando (When)</TableHead>
                        <TableHead>Quem (Who)</TableHead>
                        <TableHead>Como (How)</TableHead>
                        <TableHead>Quanto (How Much)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actionPlan.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="text-sm font-medium">{item.what}</TableCell>
                          <TableCell className="text-sm">{item.why}</TableCell>
                          <TableCell className="text-sm">{item.where}</TableCell>
                          <TableCell className="text-sm font-mono">{item.when}</TableCell>
                          <TableCell className="text-sm">{item.who}</TableCell>
                          <TableCell className="text-sm">{item.how}</TableCell>
                          <TableCell className="text-sm font-mono">{item.howMuch}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{item.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant */}
          <TabsContent value="ai" className="space-y-4">
            <Card className="border-border/50 h-[600px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary font-mono flex items-center gap-2">
                  <Brain className="h-5 w-5" /> Assistente IA de Qualidade
                </CardTitle>
                <p className="text-xs text-muted-foreground">Powered by Lovable AI — Análise de indicadores e melhoria contínua</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border border-border/50'}`}>
                        {msg.role === 'assistant' && <Bot className="h-4 w-4 mb-1 text-primary" />}
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted/50 border border-border/50 rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                  <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Pergunte sobre indicadores, PDCA, GUT..." onKeyDown={e => e.key === 'Enter' && sendAiMessage()} />
                  <Button onClick={sendAiMessage} disabled={aiLoading} className="gradient-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
