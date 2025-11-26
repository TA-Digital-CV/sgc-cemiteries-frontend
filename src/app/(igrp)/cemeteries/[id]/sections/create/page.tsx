"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPForm,
  type IGRPFormHandle,
  IGRPPageHeader,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CEMETERY_STATUS, PLOT_TYPE } from "@/app/(myapp)/types/cemetery";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type { CemeteryBlock } from "@/app/(myapp)/types/cemetery";
import { FormActions } from "@/components/forms/FormActions";
import { SectionFields } from "@/components/forms/SectionFields";

/**
 * SectionsCreatePage
 * Provides a form to create a new cemetery section under a given block.
 * Requires selecting a block and validates required fields.
 */
export default function SectionsCreatePage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");

  const { fetchBlocks, blocks, createSection, isLoading } = useCemetery();
  const [_selectedBlockId, _setSelectedBlockId] = useState<string>("");
  const { igrpToast } = useIGRPToast();
  const formRef = useRef<IGRPFormHandle<any> | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  /**
   * Validates section create form using Zod and DS form components.
   */
  const formSchema = z.object({
    blockId: z.string().min(1, "Block is required"),
    name: z.string().min(1, "Name is required"),
    // UI fields not sent to backend
    code: z.string().optional(),
    plotType: z.enum(PLOT_TYPE).optional(),
    maxCapacity: z
      .number({ message: "Max capacity must be a number" })
      .gt(0, "Max capacity must be greater than 0"),
    // Backend-aligned optional fields
    description: z.string().optional(),
    status: z.enum(CEMETERY_STATUS).default("ACTIVE"),
    geoPolygon: z.record(z.string(), z.any()).optional(),
    geoPolygonText: z.string().optional(),
  });

  /**
   * Handles validated create submission and toast feedback.
   */
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const ctx = localStorage.getItem("activeCemeteryId") ?? "";
      if (ctx && ctx !== cemeteryId) {
        igrpToast({
          title: "Erro",
          description: "Contexto de cemitério diferente do selecionado",
          type: "error",
        });
        return;
      }
    } catch {}
    if (!cemeteryId) {
      igrpToast({
        title: "Erro",
        description: "Cemetery is required",
        type: "error",
      });
      return;
    }
    let geoPolygon: Record<string, any> | undefined =
      data.geoPolygon ?? undefined;
    const text = (data.geoPolygonText ?? "").trim();
    if (text) {
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object") {
          geoPolygon = parsed as Record<string, any>;
        } else {
          throw new Error("Formato inválido de JSON");
        }
      } catch (err) {
        igrpToast({
          title: "Erro",
          description: "GeoPolygon inválido - forneça JSON válido",
          type: "error",
        });
        return;
      }
    }

    const payload = {
      cemeteryId,
      blockId: data.blockId,
      name: data.name.trim(),
      description: String(data.description ?? "").trim(),
      maxCapacity: Number(data.maxCapacity),
      status: data.status ?? "ACTIVE",
      geoPolygon: geoPolygon ?? {},
    } as any;

    const res = await createSection(payload);
    if (res.success) {
      igrpToast({
        title: "Sucesso",
        description: "Secção criado com sucesso",
        type: "success",
      });
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      const err = res.errors?.[0] || "Failed to create section";
      igrpToast({ title: "Erro", description: err, type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderSectionCreate`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries/${cemeteryId}`}
        variant={`h3`}
        title={"Novo Secção"}
        description={"Adicionar setor ao bloco"}
      >
        <div className="flex items-center gap-2">
          <FormActions
            onCancel={() => router.push(`/cemeteries/${cemeteryId}`)}
            onSubmit={() => formRef.current?.submit()}
            submitLabel="Criar"
            disabled={isLoading || !cemeteryId}
          />
        </div>
      </IGRPPageHeader>

      <IGRPForm
        schema={formSchema}
        validationMode={"onBlur"}
        formRef={formRef}
        onSubmit={onSubmit}
        defaultValues={{
          blockId: "",
          name: "",
          code: "",
          plotType: "GROUND",
          maxCapacity: 0,
          description: "",
          status: "ACTIVE",
          geoPolygon: {},
          geoPolygonText: "",
        }}
      >
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Dados do Secção</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent>
            <SectionFields
              blockOptions={blocks
                .filter((b) => b.cemeteryId === cemeteryId)
                .map((b: CemeteryBlock) => ({ value: b.id, label: b.name }))}
              capacityFieldName="maxCapacity"
              capacityLabel="Capacidade Máxima "
            />
          </IGRPCardContent>
        </IGRPCard>
      </IGRPForm>
    </div>
  );
}
