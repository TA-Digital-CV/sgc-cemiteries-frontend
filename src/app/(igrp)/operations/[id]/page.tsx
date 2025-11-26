"use client";

import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOperation } from "@/app/(myapp)/hooks/useOperation";

/**
 * Página de detalhes de uma operação específica
 * Permite visualizar informações completas e atualizar o status
 */
export default function OperationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { igrpToast } = useIGRPToast();
  const {
    operations,
    isLoading,
    error,
    fetchOperations,
    updateOperationStatus,
  } = useOperation();

  const [operation, setOperation] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const operationId = params.id as string;

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  useEffect(() => {
    if (operations.length > 0) {
      const found = operations.find((op) => op.id === operationId);
      setOperation(found);
    }
  }, [operations, operationId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!operation) return;

    try {
      setIsUpdating(true);
      await updateOperationStatus(operation.id, newStatus);

      igrpToast({
        title: "Sucesso",
        description: `Status atualizado para ${newStatus}`,
        type: "success",
      });

      // Recarregar dados
      await fetchOperations();
    } catch (err) {
      igrpToast({
        title: "Erro",
        description: "Erro ao atualizar status da operação",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "SCHEDULED":
        return "info";
      case "CANCELLED":
        return "secondary";
      default:
        return "primary";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INHUMATION: "Inumação",
      EXHUMATION: "Exumação",
      TRANSFER: "Trasladação",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <IGRPCard>
          <IGRPCardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <IGRPIcon
                iconName="RefreshCw"
                className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4"
              />
              <p className="text-gray-500">Carregando operação...</p>
            </div>
          </IGRPCardContent>
        </IGRPCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <IGRPCard>
          <IGRPCardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 font-medium">
                Erro ao carregar operação
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {error.message}
              </p>
              <IGRPButton
                variant="outline"
                size="sm"
                onClick={() => fetchOperations()}
                iconName="Refresh"
                className="mt-4"
              >
                Tentar novamente
              </IGRPButton>
            </div>
          </IGRPCardContent>
        </IGRPCard>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="container mx-auto p-6">
        <IGRPCard>
          <IGRPCardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <IGRPIcon
                iconName="AlertCircle"
                className="h-12 w-12 text-gray-300 mx-auto mb-4"
              />
              <p className="font-medium">Operação não encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">
                A operação com ID {operationId} não existe
              </p>
              <Link href="/operations">
                <IGRPButton variant="outline" size="sm" className="mt-4">
                  Voltar para lista
                </IGRPButton>
              </Link>
            </div>
          </IGRPCardContent>
        </IGRPCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/operations">
              <IGRPButton variant="ghost" size="sm" iconName="ArrowLeft">
                Voltar
              </IGRPButton>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Operação {operation.number}
          </h1>
          <p className="text-muted-foreground">
            Detalhes e histórico da operação
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IGRPBadge
            color={getStatusColor(operation.status)}
            variant="soft"
            size="lg"
          >
            {operation.status}
          </IGRPBadge>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Informações Gerais</IGRPCardTitle>
            <IGRPCardDescription>Dados básicos da operação</IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Tipo de Operação
              </label>
              <p className="text-base font-medium">
                {getTypeLabel(operation.type)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Número
              </label>
              <p className="text-base font-medium">{operation.number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="text-base font-medium">{operation.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Data Agendada
              </label>
              <p className="text-base font-medium">
                {new Date(operation.scheduledDate).toLocaleString("pt-BR")}
              </p>
            </div>
            {operation.completedDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Data de Conclusão
                </label>
                <p className="text-base font-medium">
                  {new Date(operation.completedDate).toLocaleString("pt-BR")}
                </p>
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Detalhes Adicionais</IGRPCardTitle>
            <IGRPCardDescription>
              Informações complementares
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Responsável
              </label>
              <p className="text-base font-medium">
                {operation.responsibleName || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Falecido
              </label>
              <p className="text-base font-medium">
                {operation.deceasedName || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Equipe
              </label>
              <p className="text-base font-medium">
                {operation.teamId || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cemitério
              </label>
              <p className="text-base font-medium">
                {operation.cemeteryId || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Sepultura
              </label>
              <p className="text-base font-medium">
                {operation.plotId || "N/A"}
              </p>
            </div>
          </IGRPCardContent>
        </IGRPCard>
      </div>

      {/* Observações */}
      {operation.notes && (
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Observações</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {operation.notes}
            </p>
          </IGRPCardContent>
        </IGRPCard>
      )}

      {/* Ações de Status */}
      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Atualizar Status</IGRPCardTitle>
          <IGRPCardDescription>
            Altere o status da operação conforme o progresso
          </IGRPCardDescription>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="flex flex-wrap gap-2">
            {operation.status === "SCHEDULED" && (
              <IGRPButton
                onClick={() => handleStatusUpdate("IN_PROGRESS")}
                disabled={isUpdating}
                iconName="Play"
                variant="default"
              >
                Iniciar Operação
              </IGRPButton>
            )}
            {operation.status === "IN_PROGRESS" && (
              <>
                <IGRPButton
                  onClick={() => handleStatusUpdate("COMPLETED")}
                  disabled={isUpdating}
                  iconName="CheckCircle"
                  variant="default"
                >
                  Concluir Operação
                </IGRPButton>
                <IGRPButton
                  onClick={() => handleStatusUpdate("SCHEDULED")}
                  disabled={isUpdating}
                  iconName="Pause"
                  variant="outline"
                >
                  Pausar
                </IGRPButton>
              </>
            )}
            {operation.status !== "CANCELLED" && (
              <IGRPButton
                onClick={() => handleStatusUpdate("CANCELLED")}
                disabled={isUpdating}
                iconName="XCircle"
                variant="destructive"
              >
                Cancelar Operação
              </IGRPButton>
            )}
            {operation.status === "COMPLETED" && (
              <p className="text-sm text-green-600 flex items-center gap-2">
                <IGRPIcon iconName="CheckCircle" className="h-4 w-4" />
                Operação concluída com sucesso
              </p>
            )}
            {operation.status === "CANCELLED" && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <IGRPIcon iconName="XCircle" className="h-4 w-4" />
                Operação cancelada
              </p>
            )}
          </div>
        </IGRPCardContent>
      </IGRPCard>

      {/* Metadados */}
      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Metadados</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Criado em</label>
              <p className="font-medium">
                {new Date(operation.createdDate).toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Última modificação</label>
              <p className="font-medium">
                {new Date(operation.lastModifiedDate).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
