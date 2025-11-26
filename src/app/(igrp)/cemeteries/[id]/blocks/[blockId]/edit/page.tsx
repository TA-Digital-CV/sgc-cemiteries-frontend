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
//
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type { CemeteryBlock } from "@/app/(myapp)/types/cemetery";
import { BlockFields } from "@/components/forms/BlockFields";
import { FormActions } from "@/components/forms/FormActions";

/**
 * BlockEditPage
 * Provides a form to edit an existing block. Validates capacity and code uniqueness.
 */
export default function BlockEditPage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");
  const blockId = String(params.blockId ?? "");

  const { fetchBlocks, blocks, updateBlock, isLoading } = useCemetery();
  const { igrpToast } = useIGRPToast();
  const formRef = useRef<IGRPFormHandle<any> | null>(null);

  const currentBlock = useMemo(
    () => blocks.find((b) => b.id === blockId),
    [blocks, blockId],
  );
  const [initial, setInitial] = useState<{
    name: string;
    description: string;
    maxCapacity: number;
    geoPolygon?: string;
  }>({
    name: "",
    description: "",
    maxCapacity: 0,
    geoPolygon: "",
  });

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  useEffect(() => {
    if (currentBlock) {
      setInitial({
        name: currentBlock.name,
        description: currentBlock.description || "",
        maxCapacity: Number(currentBlock.maxCapacity),
        geoPolygon: currentBlock.geoPolygon
          ? JSON.stringify(currentBlock.geoPolygon)
          : "",
      });
    }
  }, [currentBlock]);

  /**
   * Validates block edit form using Zod and DS form components.
   */
  const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    maxCapacity: z
      .number({ message: "Capacidade deve ser um número" })
      .gt(0, "Capacidade deve ser maior que 0"),
    geoPolygon: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      }, "JSON inválido"),
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
    if (!cemeteryId || !blockId) {
      igrpToast({
        title: "Erro",
        description: "Parâmetros inválidos",
        type: "error",
      });
      return;
    }

    let geoPolygonObj = {};
    if (data.geoPolygon) {
      try {
        geoPolygonObj = JSON.parse(data.geoPolygon);
      } catch (e) {
        console.error("Invalid JSON", e);
      }
    }

    const res = await updateBlock(blockId, {
      cemeteryId,
      name: data.name.trim(),
      description: data.description?.trim(),
      maxCapacity: Number(data.maxCapacity),
      geoPolygon: geoPolygonObj,
    });
    if (res.success) {
      igrpToast({
        title: "Sucesso",
        description: "Bloco atualizado com sucesso",
        type: "success",
      });
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      const err = res.errors?.[0] || "Falha ao atualizar bloco";
      igrpToast({ title: "Erro", description: err, type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderBlockEdit`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries/${cemeteryId}`}
        variant={`h3`}
        title={"Editar Bloco"}
        description={"Atualize os dados do bloco"}
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
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Dados do Bloco</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent>
            <BlockFields showDescription={true} />
            <FormActions
              onCancel={() => router.push(`/cemeteries/${cemeteryId}`)}
              onSubmit={() => formRef.current?.submit()}
              submitLabel="Salvar"
              disabled={isLoading || !cemeteryId || !blockId}
            />
          </IGRPCardContent>
        </IGRPCard>
      </IGRPForm>
    </div>
  );
}
