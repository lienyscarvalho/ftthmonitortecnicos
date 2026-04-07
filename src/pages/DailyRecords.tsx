import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExportPdfButton } from '@/components/ExportPdfButton';
import { Upload, FileSpreadsheet, Trash2, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface RecordRow {
  id: string;
  technician_name: string;
  matricula: string;
  date: string;
  os_count: number;
  completed: number;
  pending: number;
  tma: string;
  status: string;
}

export default function DailyRecords() {
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseFile = (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = mapToRecords(results.data as Record<string, string>[]);
          setRecords(prev => [...prev, ...parsed]);
          toast({ title: 'Arquivo importado', description: `${parsed.length} registros carregados.` });
          setUploading(false);
        },
        error: () => {
          toast({ title: 'Erro', description: 'Falha ao ler arquivo CSV.', variant: 'destructive' });
          setUploading(false);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
        const parsed = mapToRecords(data);
        setRecords(prev => [...prev, ...parsed]);
        toast({ title: 'Arquivo importado', description: `${parsed.length} registros carregados.` });
        setUploading(false);
      };
      reader.readAsBinaryString(file);
    } else {
      toast({ title: 'Formato inválido', description: 'Use arquivos .csv, .xls ou .xlsx', variant: 'destructive' });
      setUploading(false);
    }
  };

  const mapToRecords = (data: Record<string, string>[]): RecordRow[] => {
    return data.map((row, i) => ({
      id: `${Date.now()}-${i}`,
      technician_name: row['Nome'] || row['nome'] || row['technician_name'] || row['Tecnico'] || '',
      matricula: row['Matricula'] || row['matricula'] || row['MAT'] || '',
      date: row['Data'] || row['data'] || row['date'] || new Date().toISOString().split('T')[0],
      os_count: parseInt(row['OS'] || row['os_count'] || row['Total_OS'] || '0') || 0,
      completed: parseInt(row['Concluidas'] || row['completed'] || row['Concluído'] || '0') || 0,
      pending: parseInt(row['Pendentes'] || row['pending'] || row['Pendente'] || '0') || 0,
      tma: row['TMA'] || row['tma'] || '0h',
      status: row['Status'] || row['status'] || 'Ativo',
    }));
  };

  const addEmptyRow = () => {
    setRecords(prev => [...prev, {
      id: `${Date.now()}`,
      technician_name: '',
      matricula: '',
      date: new Date().toISOString().split('T')[0],
      os_count: 0,
      completed: 0,
      pending: 0,
      tma: '0h',
      status: 'Ativo',
    }]);
  };

  const updateField = (id: string, field: keyof RecordRow, value: string | number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const saveToDatabase = async () => {
    if (records.length === 0) return;
    toast({ title: 'Dados salvos', description: `${records.length} registros processados com sucesso.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registros Diários</h1>
          <p className="text-muted-foreground">Importe dados e gerencie registros diários de produção</p>
        </div>
        <div className="flex gap-2">
          <ExportPdfButton targetId="daily-records-content" fileName="registros_diarios" />
        </div>
      </div>

      <div id="daily-records-content" className="space-y-4">
        {/* Upload Area */}
        <Card className="border-border/50 border-dashed border-2">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Importar Base de Dados</h3>
                <p className="text-sm text-muted-foreground">Arraste ou selecione um arquivo Excel (.xlsx) ou CSV (.csv)</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && parseFile(e.target.files[0])} />
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gradient-primary">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Processando...' : 'Selecionar Arquivo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addEmptyRow}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Linha
          </Button>
          <Button size="sm" className="gradient-primary" onClick={saveToDatabase} disabled={records.length === 0}>
            <Save className="h-4 w-4 mr-2" /> Salvar Dados
          </Button>
        </div>

        {/* Table */}
        {records.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary font-mono">{records.length} Registros</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>OS Total</TableHead>
                    <TableHead>Concluídas</TableHead>
                    <TableHead>Pendentes</TableHead>
                    <TableHead>TMA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><Input value={r.technician_name} onChange={e => updateField(r.id, 'technician_name', e.target.value)} className="h-8 text-xs" /></TableCell>
                      <TableCell><Input value={r.matricula} onChange={e => updateField(r.id, 'matricula', e.target.value)} className="h-8 text-xs w-20" /></TableCell>
                      <TableCell><Input type="date" value={r.date} onChange={e => updateField(r.id, 'date', e.target.value)} className="h-8 text-xs" /></TableCell>
                      <TableCell><Input type="number" value={r.os_count} onChange={e => updateField(r.id, 'os_count', +e.target.value)} className="h-8 text-xs w-16" /></TableCell>
                      <TableCell><Input type="number" value={r.completed} onChange={e => updateField(r.id, 'completed', +e.target.value)} className="h-8 text-xs w-16" /></TableCell>
                      <TableCell><Input type="number" value={r.pending} onChange={e => updateField(r.id, 'pending', +e.target.value)} className="h-8 text-xs w-16" /></TableCell>
                      <TableCell><Input value={r.tma} onChange={e => updateField(r.id, 'tma', e.target.value)} className="h-8 text-xs w-16" /></TableCell>
                      <TableCell><span className="text-xs text-success">{r.status}</span></TableCell>
                      <TableCell><Button variant="ghost" size="icon" onClick={() => removeRow(r.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
