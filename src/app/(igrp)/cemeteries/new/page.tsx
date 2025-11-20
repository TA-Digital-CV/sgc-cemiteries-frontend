"use client";

import { cn } from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
//
import { CemeteryForm } from "@/components/cemeteries/CemeteryForm";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type { ActionResult } from "@/app/(myapp)/types/Common";
import type { Cemetery, CemeteryFormData } from "@/app/(myapp)/types/cemetery";

/**
 * NewCemeteryPage renders the form to create a new cemetery.
 * It handles submission state, error feedback and navigation using IGRP components.
 */
export default function NewCemeteryPage() {
  const router = useRouter();
  const { createCemetery } = useCemetery();
  // Local feedback state is managed by CemeteryForm

  const handleSubmit = async (
    data: CemeteryFormData,
  ): Promise<ActionResult<Cemetery>> => {
    try {
      const result = await createCemetery(data);

      if (result.success) {
        if (!result.data) {
          const msg = "Erro: dados do cemitério não retornados";
          return { success: false, errors: [msg] };
        }
        // Redirecionar para a página de detalhes do cemitério criado
        router.push(`/cemeteries/${result.data.id}`);
        return { success: true, data: result.data };
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar cemitério";
      return { success: false, errors: [errorMessage] };
    }
  };

  const handleCancel = () => {
    router.push("/cemeteries");
  };

  return (
    <div className={cn("page", "space-y-6")}>
      {/* Formulário */}
      <CemeteryForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
