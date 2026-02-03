import { TechnicianList } from '@/components/technicians/TechnicianList';

export default function Technicians() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Técnicos</h1>
        <p className="text-muted-foreground">Gerencie os técnicos de campo</p>
      </div>
      <TechnicianList />
    </div>
  );
}
