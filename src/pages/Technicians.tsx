import { TechnicianList } from '@/components/technicians/TechnicianList';
import { ExportPdfButton } from '@/components/ExportPdfButton';

export default function Technicians() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Técnicos</h1>
          <p className="text-muted-foreground">Gerencie os técnicos de campo</p>
        </div>
        <ExportPdfButton targetId="technicians-content" fileName="tecnicos" />
      </div>
      <div id="technicians-content">
        <TechnicianList />
      </div>
    </div>
  );
}
