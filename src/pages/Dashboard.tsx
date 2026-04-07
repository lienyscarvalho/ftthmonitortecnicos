import { CockpitDashboard } from '@/components/dashboard/CockpitDashboard';
import { ExportPdfButton } from '@/components/ExportPdfButton';

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportPdfButton targetId="cockpit-dashboard" fileName="dashboard_cockpit" />
      </div>
      <div id="cockpit-dashboard">
        <CockpitDashboard />
      </div>
    </div>
  );
}
