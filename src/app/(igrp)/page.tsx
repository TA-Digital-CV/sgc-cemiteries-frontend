"use client";

import { IGRPPageHeader } from "@igrp/igrp-framework-react-design-system";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name="pageHeaderDashboard"
        title="Visão Geral"
        description="Monitoramento e estatísticas do sistema de cemitérios"
        variant="h3"
      />
      <DashboardStats />
    </div>
  );
}
