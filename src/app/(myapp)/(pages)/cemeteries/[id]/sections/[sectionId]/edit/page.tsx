"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPForm,
  type IGRPFormHandle,
  IGRPIcon,
  IGRPInputNumber,
  IGRPInputText,
  IGRPLabel,
  IGRPPageHeader,
  IGRPSelect,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { FormActions } from "@/components/forms/FormActions";
import { SectionFields } from "@/components/forms/SectionFields";
import { useCemetery } from "@/hooks/useCemetery";
import type { CemeteryBlock, CemeterySection } from "@/types/cemetery";

/**
 * SectionEditPage
 * Edits a specific section, discovering its block by searching blocks/sections.
 */
export default function SectionEditPage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");
  const sectionId = String(params.sectionId ?? "");

  const { fetchBlocks, blocks, getSectionById, updateSection, isLoading } =
    useCemetery();

  const [activeBlockId, setActiveBlockId] = useState<string>("");
  const [loadedSection, setLoadedSection] = useState<CemeterySection | null>(
    null,
  );
  const [initial, setInitial] = useState<{
    name: string;
    code: string;
    plotType: "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
    totalPlots: number;
    blockId: string;
  }>({
    name: "",
    code: "",
    plotType: "GROUND",
    totalPlots: 0,
    blockId: "",
  });
  const { igrpToast } = useIGRPToast();
  const formRef = useRef<IGRPFormHandle<any> | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  useEffect(() => {
    const loadSection = async () => {
      const section = await getSectionById(sectionId);
      if (section) {
        setLoadedSection(section);
        setActiveBlockId(section.blockId);
        setInitial({
          name: section.name,
          code: section.code,
          plotType: section.plotType as any,
          totalPlots: Number(section.totalPlots),
          blockId: section.blockId,
        });
      }
    };
    void loadSection();
  }, [getSectionById, sectionId]);

  /**
   * Validates section edit form using Zod and DS form components.
   */
  const formSchema = z.object({
    blockId: z.string().min(1, "Block is required"),
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    plotType: z.enum(["GROUND", "MAUSOLEUM", "NICHE", "OSSUARY"]),
    totalPlots: z
      .number({ message: "Max capacity must be a number" })
      .gt(0, "Max capacity must be greater than 0"),
  });

  /**
   * Handles validated update submission and toast feedback.
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
    if (!cemeteryId || !sectionId || !data.blockId) {
      igrpToast({
        title: "Erro",
        description: "Invalid route parameters",
        type: "error",
      });
      return;
    }
    const res = await updateSection(sectionId, {
      name: data.name.trim(),
      code: data.code.trim(),
      plotType: data.plotType,
      totalPlots: Number(data.totalPlots),
    });
    if (res.success) {
      igrpToast({
        title: "Sucesso",
        description: "Sector atualizado com sucesso",
        type: "success",
      });
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      const err = res.errors?.[0] || "Failed to update section";
      igrpToast({ title: "Erro", description: err, type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderSectionEdit`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries/${cemeteryId}`}
        variant={`h3`}
        title={"Editar Setor"}
        description={"Atualize os dados do setor"}
      >
        <div className="flex items-center gap-2">
          <IGRPButton
            variant={`default`}
            size={`default`}
            showIcon={true}
            iconName={`Save`}
            onClick={() => formRef.current?.submit()}
          >
            Salvar
          </IGRPButton>
        </div>
      </IGRPPageHeader>

      <IGRPForm
        schema={formSchema}
        validationMode={"onBlur"}
        formRef={formRef}
        onSubmit={onSubmit}
        defaultValues={initial}
      >
        <>
          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle>Dados do Setor</IGRPCardTitle>
            </IGRPCardHeader>
            <IGRPCardContent>
              <SectionFields
                blockOptions={blocks
                  .filter((b) => b.cemeteryId === cemeteryId)
                  .map((b: CemeteryBlock) => ({ value: b.id, label: b.name }))}
                capacityFieldName="totalPlots"
                capacityLabel="Capacidade Máxima "
              />
              <FormActions
                onCancel={() => router.push(`/cemeteries/${cemeteryId}`)}
                onSubmit={() => formRef.current?.submit()}
                submitLabel="Salvar"
                disabled={isLoading || !cemeteryId || !sectionId}
              />
            </IGRPCardContent>
          </IGRPCard>
        </>
      </IGRPForm>
    </div>
  );
}
