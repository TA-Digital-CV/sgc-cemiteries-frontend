"use client";

import {
  cn,
  IGRPCard,
  IGRPCardContent,
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type { ActionResult } from "@/app/(myapp)/types/Common";
import type { Cemetery, CemeteryFormData } from "@/app/(myapp)/types/cemetery";
//
import { CemeteryForm } from "@/components/cemeteries/CemeteryForm";

/**
 * NewCemeteryPage renders the form to create a new cemetery.
 * It handles submission state, error feedback and navigation using IGRP components.
 */
export default function NewCemeteryPage() {
  const router = useRouter();
  const { createCemetery } = useCemetery();
  // Local feedback state is managed by CemeteryForm
  const [activeMunicipalityId, setActiveMunicipalityId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * initMunicipalityContext
   * Initializes municipality context from localStorage or environment.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("activeMunicipalityId") ?? "";
      if (stored) {
        setActiveMunicipalityId(stored);
        setErrorMessage(null);
      } else {
        const envId = String(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || "");
        if (envId) {
          localStorage.setItem("activeMunicipalityId", envId);
          setActiveMunicipalityId(envId);
          setErrorMessage(null);
        } else {
          setErrorMessage(
            "Error: municipalityId context not available. Please select a municipality.",
          );
        }
      }
    } catch {
      setErrorMessage(
        "Error: failed to access storage for municipality context",
      );
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "activeMunicipalityId") {
        setActiveMunicipalityId(String(e.newValue || ""));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSubmit = async (
    data: CemeteryFormData,
  ): Promise<ActionResult<Cemetery>> => {
    try {
      if (!data.municipalityId) {
        return {
          success: false,
          errors: ["Error: municipalityId is required to create cemetery"],
        };
      }
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
      {!activeMunicipalityId || errorMessage ? (
        <IGRPCard>
          <IGRPCardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-red-600 font-medium">
                Município obrigatório
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {errorMessage || "Defina um município ativo antes de continuar"}
              </p>
            </div>
          </IGRPCardContent>
        </IGRPCard>
      ) : (
        <CemeteryForm
          municipalityId={activeMunicipalityId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
