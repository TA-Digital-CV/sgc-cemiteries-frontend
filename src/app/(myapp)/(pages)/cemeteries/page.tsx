"use client";

import { cn, IGRPButton } from "@igrp/igrp-framework-react-design-system";
import { CemeteryList } from "@/components/cemeteries/CemeteryList";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useRouter } from "next/navigation";
/**
 * CemeteriesPage shows overview metrics and the cemetery list.
 * Uses IGRP components for layout and actions and removes lucide-react.
 */

export default function CemeteriesPage() {
  const router = useRouter();

  function goToCemeteries(row?: any): void {
    router.push(`/cemeteries`);
  }

  function goToNewCemetery(row?: any): void {
    router.push(`/cemeteries/new`);
  }

  function goToMaps(row?: any): void {
    router.push(`/maps`);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cemitérios</h1>
          <p className="text-muted-foreground">
            Gerencie todos os cemitérios do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <IGRPButton
            variant={"default"}
            size={`default`}
            showIcon={true}
            iconName={"Plus"}
            className={cn()}
            onClick={() => goToNewCemetery()}
          >
            Novo Cemitério
          </IGRPButton>
          <IGRPButton
            variant={"outline"}
            size={`default`}
            showIcon={true}
            iconName={"ChartSpline"}
            className={cn()}
            onClick={() => goToCemeteries()}
          >
            Análises
          </IGRPButton>
          <IGRPButton
            variant="outline"
            size={`default`}
            showIcon={true}
            iconName={"Map"}
            className={cn()}
            onClick={() => goToMaps()}
          >
            Mapas
          </IGRPButton>
        </div>
      </div>

      {/* Dashboard Overview */}
      <DashboardMetrics />

      {/* Quick Stats removidos: sem números hardcoded */}

      {/* Cemetery List */}
      <CemeteryList />
    </div>
  );
}
