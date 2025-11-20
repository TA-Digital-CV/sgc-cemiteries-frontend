"use client";

import {
  IGRPBadge,
  IGRPPageHeader,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PlotForm } from "@/components/forms/PlotForm";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import { usePlot } from "@/app/(myapp)/hooks/usePlot";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/app/(myapp)/types/cemetery";
import type { PlotFormData } from "@/app/(myapp)/types/Plot";

/**
 * PlotsCreatePage
 * Renders a dedicated page to create plots, aligned with FE-01 blueprint.
 * Uses IGRP DS primitives and existing hooks for data and validations.
 */
export default function PlotsCreatePage() {
  /**
   * PlotsCreatePage aligns structure with list pages:
   * - Uses IGRPPageHeader for consistent header layout
   * - Controlled selects with validation and context awareness
   * - Toast-based error handling consistent with DS
   */
  const router = useRouter();
  const params = useParams();
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
  } = useCemetery();
  const { createPlot, isLoading } = usePlot();
  const perms = String(process.env.NEXT_PUBLIC_PERMISSIONS || "")
    .split(",")
    .map((p) => p.trim().toUpperCase());
  const _canWritePlots = perms.includes("PLOTS_WRITE");

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [_selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [_form, _setForm] = useState<PlotFormData>({
    cemeteryId: "",
    blockId: "",
    sectionId: "",
    plotNumber: "",
    plotType: "GROUND",
    geoPoint: undefined,
    dimensions: { width: 0, length: 0, unit: "meters" },
    notes: "",
  });
  const { igrpToast } = useIGRPToast();
  const activeCemeteryName = useMemo(() => {
    const c = cemeteries.find((x) => x.id === selectedCemeteryId);
    return c?.name ?? "";
  }, [cemeteries, selectedCemeteryId]);

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);
  useEffect(() => {
    const cemeteryIdParam = String(params.id ?? "");
    if (cemeteryIdParam) setSelectedCemeteryId(cemeteryIdParam);
  }, [params]);
  useEffect(() => {
    if (selectedCemeteryId) {
      void fetchBlocks(selectedCemeteryId);
    }
  }, [selectedCemeteryId, fetchBlocks]);
  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId) {
      void fetchSections(selectedCemeteryId, selectedBlockId);
    }
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  /**
   * Handles submit from PlotForm and integrates with existing API.
   */
  const onSubmit = async (data: PlotFormData) => {
    const res = await createPlot(data);
    if (res?.success) {
      igrpToast({
        title: "Sucesso",
        description: "Sepultura criada com sucesso",
        type: "success",
      });
      router.push(`/plots?cemeteryId=${data.cemeteryId}`);
    } else if (res?.errors?.[0]) {
      igrpToast({
        title: "Erro",
        description: String(res.errors[0]),
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderPlotCreate`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/plots?cemeteryId=${selectedCemeteryId}`}
        variant={`h3`}
        title={"Nova Sepultura"}
        description={"Cadastre uma nova sepultura"}
      ></IGRPPageHeader>

      <div className="flex items-center gap-2">
        {selectedCemeteryId && activeCemeteryName && (
          <IGRPBadge color="info" variant="soft" size="sm">
            {activeCemeteryName}
          </IGRPBadge>
        )}
      </div>
      <PlotForm
        defaultValues={{
          cemeteryId: selectedCemeteryId,
          blockId: "",
          sectionId: "",
          plotNumber: "",
          plotType: "GROUND",
          geoPoint: { latitude: 0, longitude: 0 },
          dimensions: { width: 0, length: 0, unit: "meters" },
          notes: "",
        }}
        cemeteryOptions={cemeteries.map((c: Cemetery) => ({
          value: c.id,
          label: c.name,
        }))}
        blockOptions={blocks.map((b: CemeteryBlock) => ({
          value: b.id,
          label: b.name,
        }))}
        sectionOptions={sections.map((s: CemeterySection) => ({
          value: s.id,
          label: s.name,
        }))}
        onCemeteryChange={(id) => {
          setSelectedCemeteryId(id);
          setSelectedBlockId("");
          setSelectedSectionId("");
          if (id) void fetchBlocks(id);
        }}
        onBlockChange={(id) => {
          setSelectedBlockId(id);
          setSelectedSectionId("");
          if (selectedCemeteryId && id)
            void fetchSections(selectedCemeteryId, id);
        }}
        onSectionChange={(id) => setSelectedSectionId(id)}
        onSubmit={onSubmit}
        onCancel={() => router.push(`/plots?cemeteryId=${selectedCemeteryId}`)}
        loading={isLoading}
      />
    </div>
  );
}
