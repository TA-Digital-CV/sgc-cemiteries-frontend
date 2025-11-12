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
  IGRPLabel,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import type { Cemetery } from "@/types/cemetery";

/**
 * CemeteryDetailPage
 *
 * Renders cemetery detail view using IGRP Design System components.
 * Aligns displayed fields with current Cemetery type schema.
 */
export default function CemeteryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cemeteryId = params.id as string;

  const { selectCemetery, deleteCemetery, isLoading, error, selectedCemetery } =
    useCemetery();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Loads cemetery details for detail view.
   * Memoized to align with lint rules on hook dependencies.
   */
  const loadCemetery = useCallback(async () => {
    await selectCemetery(cemeteryId);
  }, [cemeteryId, selectCemetery]);

  useEffect(() => {
    if (cemeteryId) {
      void loadCemetery();
    }
  }, [cemeteryId, loadCemetery]);

  const handleDelete = async () => {
    try {
      const result = await deleteCemetery(cemeteryId);

      if (result.success) {
        router.push("/cemeteries");
      } else {
        setLocalError(result.errors?.[0] || "Erro ao excluir cemitério");
      }
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erro ao excluir cemitério",
      );
    }
  };

  const getStatusBadgeColor = (status: string) => {
    // Map both lowercase and uppercase API values to design system colors
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "MAINTENANCE":
        return "warning";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "Ativo";
      case "INACTIVE":
        return "Inativo";
      case "MAINTENANCE":
        return "Em Manutenção";
      default:
        return status;
    }
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

  if (localError || error || !selectedCemetery) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/cemeteries">
            <IGRPButton variant="outline" size="sm">
              <IGRPIcon iconName="ArrowLeft" className="h-4 w-4 mr-2" />
              Voltar
            </IGRPButton>
          </Link>
        </div>
        <IGRPCard className="border border-red-200">
          <IGRPCardHeader>
            <IGRPCardTitle className="text-red-600 flex items-center">
              <IGRPIcon iconName="AlertTriangle" className="h-5 w-5 mr-2" />
              Erro ao carregar cemitério
            </IGRPCardTitle>
            <IGRPCardDescription>
              {localError || error || "Cemitério não encontrado"}
            </IGRPCardDescription>
          </IGRPCardHeader>
        </IGRPCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/cemeteries">
            <IGRPButton variant="outline" size="sm">
              <IGRPIcon iconName="ArrowLeft" className="h-4 w-4 mr-2" />
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {selectedCemetery.name}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <IGRPBadge
                variant="soft"
                color={getStatusBadgeColor(selectedCemetery.status)}
              >
                {getStatusLabel(selectedCemetery.status)}
              </IGRPBadge>
              <span className="text-muted-foreground">
                {selectedCemetery.address}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/cemeteries/${cemeteryId}/edit`}>
            <IGRPButton type="button" variant="outline">
              <IGRPIcon iconName="Edit" className="h-4 w-4 mr-2" />
              Editar
            </IGRPButton>
          </Link>
          <Link href={`/analytics?cemetery=${cemeteryId}`}>
            <IGRPButton type="button" variant="outline">
              <IGRPIcon iconName="BarChart3" className="h-4 w-4 mr-2" />
              Analytics
            </IGRPButton>
          </Link>
          <Link href={`/maps?cemetery=${cemeteryId}`}>
            <IGRPButton type="button" variant="outline">
              <IGRPIcon iconName="Map" className="h-4 w-4 mr-2" />
              Mapa
            </IGRPButton>
          </Link>
          <IGRPButton
            type="button"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <IGRPIcon iconName="Trash2" className="h-4 w-4 mr-2" />
            Excluir
          </IGRPButton>
        </div>
      </div>

      {/* Grid de informações */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações básicas */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Informações Básicas</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent className="space-y-4">
            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Nome
              </IGRPLabel>
              <p className="text-base">{selectedCemetery.name}</p>
            </div>

            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground flex items-center">
                <IGRPIcon iconName="Calendar" className="h-4 w-4 mr-2" />
                Datas
              </IGRPLabel>
              <p className="text-sm text-muted-foreground">
                Criado:{" "}
                {new Date(selectedCemetery.createdDate).toLocaleDateString(
                  "pt-BR",
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Atualizado:{" "}
                {new Date(selectedCemetery.lastModifiedDate).toLocaleDateString(
                  "pt-BR",
                )}
              </p>
            </div>

            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Capacidade Máxima
              </IGRPLabel>
              <p className="text-base">
                {selectedCemetery.maxCapacity.toLocaleString("pt-BR")}{" "}
                sepulturas
              </p>
            </div>

            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Ocupação Atual
              </IGRPLabel>
              <p className="text-base">
                {selectedCemetery.currentOccupancy.toLocaleString("pt-BR")}{" "}
                sepulturas
              </p>
            </div>

            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Taxa de Ocupação
              </IGRPLabel>
              <p className="text-base">{selectedCemetery.occupancyRate}%</p>
            </div>
          </IGRPCardContent>
        </IGRPCard>

        {/* Endereço */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="MapPin" className="h-5 w-5 mr-2" />
              Endereço
            </IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent className="space-y-3">
            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Endereço
              </IGRPLabel>
              <p className="text-base">{selectedCemetery.address}</p>
            </div>

            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Coordenadas
              </IGRPLabel>
              <p className="text-base">
                {selectedCemetery.geoPoint.latitude.toFixed(6)},{" "}
                {selectedCemetery.geoPoint.longitude.toFixed(6)}
              </p>
            </div>
          </IGRPCardContent>
        </IGRPCard>

        {/* Contato */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="Phone" className="h-5 w-5 mr-2" />
              Contato
            </IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent className="space-y-3">
            {selectedCemetery.metadata?.contact?.phone && (
              <div>
                <IGRPLabel className="text-sm font-medium text-muted-foreground flex items-center">
                  <IGRPIcon iconName="Phone" className="h-4 w-4 mr-2" />
                  Telefone
                </IGRPLabel>
                <p className="text-base">
                  {selectedCemetery.metadata.contact.phone}
                </p>
              </div>
            )}

            {selectedCemetery.metadata?.contact?.email && (
              <div>
                <IGRPLabel className="text-sm font-medium text-muted-foreground flex items-center">
                  <IGRPIcon iconName="Mail" className="h-4 w-4 mr-2" />
                  Email
                </IGRPLabel>
                <p className="text-base">
                  {selectedCemetery.metadata.contact.email}
                </p>
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>

        {/* Responsável */}
        {selectedCemetery.metadata?.contact?.responsible && (
          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle className="flex items-center">
                <IGRPIcon iconName="User" className="h-5 w-5 mr-2" />
                Responsável
              </IGRPCardTitle>
            </IGRPCardHeader>
            <IGRPCardContent className="space-y-3">
              <div>
                <IGRPLabel className="text-sm font-medium text-muted-foreground">
                  Nome
                </IGRPLabel>
                <p className="text-base">
                  {selectedCemetery.metadata.contact.responsible}
                </p>
              </div>
            </IGRPCardContent>
          </IGRPCard>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <IGRPCard className="max-w-md w-full mx-4">
            <IGRPCardHeader>
              <IGRPCardTitle className="text-red-600">
                Confirmar Exclusão
              </IGRPCardTitle>
              <IGRPCardDescription>
                Tem certeza que deseja excluir o cemitério "
                {selectedCemetery?.name ?? ""}"? Esta ação não pode ser
                desfeita.
              </IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent className="flex justify-end space-x-3">
              <IGRPButton
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </IGRPButton>
              <IGRPButton variant="outline" onClick={handleDelete}>
                <IGRPIcon iconName="Trash2" className="h-4 w-4 mr-2" />
                Excluir
              </IGRPButton>
            </IGRPCardContent>
          </IGRPCard>
        </div>
      )}
    </div>
  );
}
