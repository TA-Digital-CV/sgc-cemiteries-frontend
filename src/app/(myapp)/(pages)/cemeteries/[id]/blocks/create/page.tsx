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
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { BlockFields } from "@/components/forms/BlockFields";
import { FormActions } from "@/components/forms/FormActions";
import { useCemetery } from "@/hooks/useCemetery";
import type { CemeteryBlock } from "@/types/cemetery";

/**
 * BlocksCreatePage
 * Provides a form to create a new cemetery block under a given cemetery.
 * Validates required fields and uniqueness of code within the cemetery.
 */
export default function BlocksCreatePage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");

  const { fetchBlocks, blocks, createBlock, isLoading } = useCemetery();
  const { igrpToast } = useIGRPToast();
  const formRef = useRef<IGRPFormHandle<any> | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  const isCodeDuplicate = useMemo(() => {
    return (code: string) => {
      const codeNorm = String(code).trim().toLowerCase();
      return blocks.some(
        (b: CemeteryBlock) =>
          b.cemeteryId === cemeteryId &&
          String(b.code).toLowerCase() === codeNorm,
      );
    };
  }, [blocks, cemeteryId]);

  /**
   * Validates block create form using Zod and DS form components.
   */
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
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
    if (isCodeDuplicate(data.code)) {
      igrpToast({
        title: "Erro",
        description: "Code must be unique in this cemetery",
        type: "error",
      });
      return;
    }
    const res = await createBlock({
      cemeteryId,
      name: data.name.trim(),
      maxCapacity: Number(data.maxCapacity),
      code: data.code.trim(),
    });
    if (res.success) {
      igrpToast({
        title: "Sucesso",
        description: "Bloco criado com sucesso",
        type: "success",
      });
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      const err = res.errors?.[0] || "Failed to create block";
      igrpToast({ title: "Erro", description: err, type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderBlockCreate`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries/${cemeteryId}`}
        variant={`h3`}
        title={"Novo Bloco"}
        description={"Adicionar bloco ao cemitério"}
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
        defaultValues={{ name: "", code: "", maxCapacity: 0 }}
      >
        <>
          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle>Dados do Bloco</IGRPCardTitle>
            </IGRPCardHeader>
            <IGRPCardContent>
              <BlockFields
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
