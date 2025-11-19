"use client";

import {
  cn,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CemeteryForm } from "@/components/cemeteries/CemeteryForm";
import { useCemetery } from "@/hooks/useCemetery";
import type { ActionResult } from "@/types/Common";
import type { Cemetery, CemeteryFormData } from "@/types/cemetery";

/**
 * EditCemeteryPage renders the edit form for a specific cemetery.
 * It loads the cemetery details, handles submit and cancel actions,
 * and shows appropriate loading and error states using IGRP components.
 */
export default function EditCemeteryPage() {
  const params = useParams();
  const router = useRouter();
  const cemeteryId = params.id as string;

  const { selectCemetery, updateCemetery, isLoading, error, selectedCemetery } =
    useCemetery();

  /**
   * Loads cemetery details based on current `cemeteryId`.
   * Memoized to satisfy hook dependency rules and avoid unnecessary re-renders.
   */
  const loadCemetery = useCallback(async () => {
    await selectCemetery(cemeteryId);
  }, [cemeteryId, selectCemetery]);

  useEffect(() => {
    if (cemeteryId) {
      void loadCemetery();
    }
  }, [cemeteryId, loadCemetery]);

  const handleSubmit = async (
    data: CemeteryFormData,
  ): Promise<ActionResult<any>> => {
    try {
      const result = await updateCemetery(cemeteryId, data);

      if (result.success) {
        // Redirecionar para a página de detalhes do cemitério
        router.push(`/cemeteries/${cemeteryId}`);
        return { success: true, data: result.data };
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar cemitério";
      return { success: false, errors: [errorMessage] };
    }
  };

  const handleCancel = () => {
    router.push(`/cemeteries/${cemeteryId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <IGRPIcon iconName="Loader2" className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando cemitério...</span>
        </div>
      </div>
    );
  }

  if (error || !selectedCemetery) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/cemeteries">
            <IGRPButton
              type="button"
              variant="ghost"
              size="sm"
              showIcon
              iconName="ArrowLeft"
            >
              Voltar
            </IGRPButton>
          </Link>
        </div>
        <IGRPCard>
          <IGRPCardHeader>
            <div className="flex items-center space-x-2">
              <IGRPIcon iconName="AlertTriangle" className="h-5 w-5" />
              <IGRPCardTitle>Erro ao carregar cemitério</IGRPCardTitle>
            </div>
            <IGRPCardDescription>
              {error || "Cemitério não encontrado"}
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent>
            <p className="text-muted-foreground">
              Tente novamente mais tarde ou retorne à lista.
            </p>
          </IGRPCardContent>
        </IGRPCard>
      </div>
    );
  }

  return (
    <div className={cn("page", "space-y-6")}>
      {/* Formulário */}
      <CemeteryForm
        cemetery={selectedCemetery}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
