"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPInputText,
  IGRPSelect,
  IGRPTextarea,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOperation } from "@/app/(myapp)/hooks/useOperation";
import { OPERATION_TYPE } from "@/app/(myapp)/types/Operation";
import type { OperationType } from "@/app/(myapp)/types/Operation";

/**
 * Página de criação de nova operação
 * Formulário com validação para agendar operações cemiteriais
 */
export default function NewOperationPage() {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();
  const { createOperation } = useOperation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    cemeteryId: "",
    plotId: "",
    scheduledDate: "",
    responsibleName: "",
    deceasedName: "",
    teamId: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = "Tipo de operação é obrigatório";
    }
    if (!formData.cemeteryId) {
      newErrors.cemeteryId = "Cemitério é obrigatório";
    }
    if (!formData.plotId) {
      newErrors.plotId = "Sepultura é obrigatória";
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Data agendada é obrigatória";
    }
    if (!formData.deceasedName) {
      newErrors.deceasedName = "Nome do falecido é obrigatório";
    }
    if (!formData.responsibleName) {
      newErrors.responsibleName = "Nome do responsável é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      igrpToast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await createOperation({
        ...formData,
        type: formData.type as OperationType,
        status: "PENDING",
        scheduledDate: new Date(formData.scheduledDate),
      });

      igrpToast({
        title: "Sucesso",
        description: "Operação criada com sucesso",
        type: "success",
      });

      // Redirecionar para lista
      router.push("/operations");
    } catch (error) {
      igrpToast({
        title: "Erro",
        description: "Erro ao criar operação. Tente novamente.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/operations">
            <IGRPButton variant="ghost" size="sm" iconName="ArrowLeft">
              Voltar
            </IGRPButton>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Operação</h1>
        <p className="text-muted-foreground">
          Agende uma nova operação cemiterial
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle>Informações Básicas</IGRPCardTitle>
              <IGRPCardDescription>
                Dados essenciais da operação
              </IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tipo de Operação *
                </label>
                {(() => {
                  const typeOptions = OPERATION_TYPE.map((value) => ({
                    value,
                    label:
                      value === "INHUMATION"
                        ? "Inumação"
                        : value === "EXHUMATION"
                          ? "Exumação"
                          : value === "TRANSFER"
                            ? "Trasladação"
                            : "Manutenção",
                  }));
                  return (
                    <IGRPSelect
                      value={formData.type}
                      onValueChange={(value) =>
                        handleChange("type", String(value))
                      }
                      options={typeOptions as any}
                      placeholder="Selecione o tipo"
                    />
                  );
                })()}
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Data e Hora Agendada *
                </label>
                <IGRPInputText
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    handleChange("scheduledDate", e.target.value)
                  }
                  placeholder="Selecione data e hora"
                />
                {errors.scheduledDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.scheduledDate}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cemitério *
                </label>
                <IGRPInputText
                  value={formData.cemeteryId}
                  onChange={(e) => handleChange("cemeteryId", e.target.value)}
                  placeholder="ID do cemitério"
                />
                {errors.cemeteryId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.cemeteryId}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Ex: cem-001, cem-002
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sepultura *
                </label>
                <IGRPInputText
                  value={formData.plotId}
                  onChange={(e) => handleChange("plotId", e.target.value)}
                  placeholder="ID da sepultura"
                />
                {errors.plotId && (
                  <p className="text-sm text-red-600 mt-1">{errors.plotId}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Ex: plot-001, plot-002
                </p>
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {/* Informações Adicionais */}
          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle>Informações Adicionais</IGRPCardTitle>
              <IGRPCardDescription>Dados complementares</IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nome do Falecido *
                </label>
                <IGRPInputText
                  value={formData.deceasedName}
                  onChange={(e) => handleChange("deceasedName", e.target.value)}
                  placeholder="Nome completo"
                />
                {errors.deceasedName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.deceasedName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Responsável pela Operação *
                </label>
                <IGRPInputText
                  value={formData.responsibleName}
                  onChange={(e) =>
                    handleChange("responsibleName", e.target.value)
                  }
                  placeholder="Nome do responsável"
                />
                {errors.responsibleName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.responsibleName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Equipe</label>
                <IGRPInputText
                  value={formData.teamId}
                  onChange={(e) => handleChange("teamId", e.target.value)}
                  placeholder="ID da equipe (opcional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ex: team-001, team-002
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Observações
                </label>
                <IGRPTextarea
                  name={"notes"}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Informações adicionais sobre a operação..."
                  rows={4}
                />
              </div>
            </IGRPCardContent>
          </IGRPCard>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 mt-6">
          <Link href="/operations">
            <IGRPButton type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </IGRPButton>
          </Link>
          <IGRPButton
            type="submit"
            disabled={isSubmitting}
            iconName={isSubmitting ? "RefreshCw" : "CheckCircle"}
            className={isSubmitting ? "animate-pulse" : ""}
          >
            {isSubmitting ? "Criando..." : "Criar Operação"}
          </IGRPButton>
        </div>
      </form>
    </div>
  );
}
