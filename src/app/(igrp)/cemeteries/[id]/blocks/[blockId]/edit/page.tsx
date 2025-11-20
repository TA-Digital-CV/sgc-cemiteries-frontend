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
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { BlockFields } from "@/components/forms/BlockFields";
import { FormActions } from "@/components/forms/FormActions";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type { CemeteryBlock } from "@/app/(myapp)/types/cemetery";

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
    code: string;
    totalPlots: number;
  }>({
    name: "",
    code: "",
    totalPlots: 0,
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
        code: currentBlock.code,
        totalPlots: Number(currentBlock.totalPlots),
      });
    }
  }, [currentBlock]);

  const isCodeDuplicate = useMemo(() => {
    return (code: string) => {
      const codeNorm = String(code).trim().toLowerCase();
      return blocks.some(
        (b: CemeteryBlock) =>
          b.cemeteryId === cemeteryId &&
          b.id !== blockId &&
          String(b.code).toLowerCase() === codeNorm,
      );
    };
  }, [blocks, cemeteryId, blockId]);

  /**
   * Validates block edit form using Zod and DS form components.
   */
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
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
    if (!cemeteryId || !blockId) {
      igrpToast({
        title: "Erro",
        description: "Invalid route parameters",
        type: "error",
      });
      return;
    }
    if (isCodeDuplicate(data.code)) {
      igrpToast({
        title: "Erro",
        description: "Code must be unique in this cemetery",
        type: "error",
      });
      return;
    }
    const res = await updateBlock(blockId, {
      name: data.name.trim(),
      code: data.code.trim(),
      totalPlots: Number(data.totalPlots),
    });
    if (res.success) {
      igrpToast({
        title: "Sucesso",
        description: "Bloco atualizado com sucesso",
        type: "success",
      });
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      const err = res.errors?.[0] || "Failed to update block";
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
            <BlockFields
              capacityFieldName="totalPlots"
              capacityLabel="Capacidade Máxima "
            />
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
