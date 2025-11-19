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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { FormActions } from "@/components/forms/FormActions";
import { SectionFields } from "@/components/forms/SectionFields";
import { useCemetery } from "@/hooks/useCemetery";
import type { CemeteryBlock } from "@/types/cemetery";

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
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
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
    code: z.string().min(1, "Code is required"),
    plotType: z.enum(["GROUND", "MAUSOLEUM", "NICHE", "OSSUARY"]),
    maxCapacity: z
      .number({ message: "Max capacity must be a number" })
      .gt(0, "Max capacity must be greater than 0"),
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
    const res = await createSection({
      cemeteryId,
      blockId: data.blockId,
      name: data.name.trim(),
      code: data.code.trim(),
      plotType: data.plotType,
      maxCapacity: Number(data.maxCapacity),
    });
    if (res.success) {
      igrpToast({
        title: "Sucesso",
        description: "Sector criado com sucesso",
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
        title={"Novo Setor"}
        description={"Adicionar setor ao bloco"}
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
        defaultValues={{
          blockId: "",
          name: "",
          code: "",
          plotType: "GROUND",
          maxCapacity: 0,
        }}
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
                capacityFieldName="maxCapacity"
                capacityLabel="Capacidade Máxima "
              />
              <FormActions
                onCancel={() => router.push(`/cemeteries/${cemeteryId}`)}
                onSubmit={() => formRef.current?.submit()}
                submitLabel="Criar"
                disabled={isLoading || !cemeteryId}
              />
            </IGRPCardContent>
          </IGRPCard>
        </>
      </IGRPForm>
    </div>
  );
}
