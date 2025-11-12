"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CemeteryForm } from "@/components/cemeteries/CemeteryForm";
import { useCemetery } from "@/hooks/useCemetery";
import type { ActionResult } from "@/types/Common";
import type { CemeteryFormData } from "@/types/cemetery";

/**
 * NewCemeteryPage renders the form to create a new cemetery.
 * It handles submission state, error feedback and navigation using IGRP components.
 */
export default function NewCemeteryPage() {
  const router = useRouter();
  const { createCemetery } = useCemetery();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    data: CemeteryFormData,
  ): Promise<ActionResult<any>> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCemetery(data);

      if (result.success) {
        if (!result.data) {
          const msg = "Erro: dados do cemitério não retornados";
          setError(msg);
          return { success: false, errors: [msg] };
        }
        // Redirecionar para a página de detalhes do cemitério criado
        router.push(`/cemeteries/${result.data.id}`);
        return { success: true, data: result.data };
      } else {
        setError(result.errors?.[0] || "Erro ao criar cemitério");
        return { success: false, errors: result.errors };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar cemitério";
      setError(errorMessage);
      return { success: false, errors: [errorMessage] };
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/cemeteries");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/cemeteries">
            <IGRPButton variant="ghost" size="sm">
              <IGRPIcon iconName="ArrowLeft" className="h-4 w-4 mr-2" />
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Novo Cemitério
            </h1>
            <p className="text-muted-foreground">
              Cadastre um novo cemitério no sistema
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <IGRPCard>
          <IGRPCardHeader>
            <div className="flex items-center space-x-2">
              <IGRPIcon iconName="AlertTriangle" className="h-5 w-5" />
              <IGRPCardTitle>Erro ao criar cemitério</IGRPCardTitle>
            </div>
            <IGRPCardDescription>{error}</IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent>
            <p className="text-muted-foreground">
              Verifique os dados informados e tente novamente.
            </p>
          </IGRPCardContent>
        </IGRPCard>
      )}

      {/* Formulário */}
      <CemeteryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
