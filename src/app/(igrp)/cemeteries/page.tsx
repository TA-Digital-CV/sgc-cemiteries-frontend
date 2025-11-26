"use client";

import {
  cn,
  IGRPButton,
  IGRPBadge,
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CemeteryList } from "@/components/cemeteries/CemeteryList";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
/**
 * CemeteriesPage
 * Passes municipalityId to child components; municipality is required for filters.
 */

export default function CemeteriesPage() {
  const router = useRouter();
  const perms = String(process.env.NEXT_PUBLIC_PERMISSIONS || "")
    .split(",")
    .map((p) => p.trim().toUpperCase());
  const canWriteCemetery = perms.includes("CEMETERY_WRITE");

  const [selectedMunicipalityId, setSelectedMunicipalityId] =
    useState<string>("");
  const [selectedMunicipalityName, setSelectedMunicipalityName] =
    useState<string>("");

  function goToCemeteries(_row?: unknown): void {
    router.push(`/cemeteries`);
  }

  function goToNewCemetery(_row?: unknown): void {
    router.push(`/cemeteries/new`);
  }

  function goToMaps(_row?: unknown): void {
    router.push(`/maps`);
  }

  /**
   * restoreActiveMunicipality
   * Restores the active municipality id from localStorage on mount.
   */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("activeMunicipalityId") ?? "";
      const storedName =
        window.localStorage.getItem("activeMunicipalityName") ?? "";
      if (stored) setSelectedMunicipalityId(stored);
      if (storedName) setSelectedMunicipalityName(storedName);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className="flex items-center gap-2"></div>
          {/* Badge do nome do município */}
          {selectedMunicipalityId && (
            <IGRPBadge color="primary" variant="soft" size="sm">
              Município: {selectedMunicipalityName || selectedMunicipalityId}
            </IGRPBadge>
          )}
          {canWriteCemetery && (
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
          )}
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
      <DashboardMetrics municipalityId={selectedMunicipalityId} />

      {/* Cemetery List */}
      <CemeteryList municipalityId={selectedMunicipalityId} />
    </div>
  );
}
