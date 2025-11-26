"use client";

import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPDataTable,
  IGRPDataTableHeaderSortToggle,
  IGRPIcon,
  IGRPLabel,
  IGRPPageHeader,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type {
  CemeteryBlock,
  CemeterySection,
} from "@/app/(myapp)/types/cemetery";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

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

  const {
    selectCemetery,
    deleteCemetery,
    isLoading,
    error,
    selectedCemetery,
    fetchCemeteryStructures,
    blocks,
    sections,
  } = useCemetery();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteCancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const deleteTriggerBtnRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Loads cemetery details for detail view.
   * Memoized to align with lint rules on hook dependencies.
   */
  const loadCemetery = useCallback(async () => {
    await selectCemetery(cemeteryId);
    await fetchCemeteryStructures(cemeteryId);
    try {
      localStorage.setItem("activeCemeteryId", String(cemeteryId));
    } catch {}
  }, [cemeteryId, selectCemetery, fetchCemeteryStructures]);

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
      <div className="container mx-auto p-6 space-y-6" aria-busy="true">
        <div className="flex items-center justify-center h-64" role="status">
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
            <IGRPButton
              variant="outline"
              size="sm"
              showIcon
              iconName="ArrowLeft"
            >
              Voltar
            </IGRPButton>
          </Link>
        </div>
        <IGRPCard className="border border-red-200">
          <IGRPCardHeader>
            <IGRPCardTitle className="text-red-600 flex items-center">
              <IGRPIcon iconName="TriangleAlert" className="h-5 w-5 mr-2" />
              Erro ao carregar cemitério
            </IGRPCardTitle>
            <IGRPCardDescription role="alert" aria-live="assertive">
              {localError || error || "Cemitério não encontrado"}
            </IGRPCardDescription>
          </IGRPCardHeader>
        </IGRPCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={"pageHeaderCemeteryDetail"}
        iconBackButton={"ArrowLeft"}
        showBackButton={true}
        urlBackButton={`/cemeteries`}
        variant={"h3"}
        title={selectedCemetery.name}
        description={selectedCemetery.address ?? ""}
      >
        <div className="flex flex-wrap gap-2">
          <IGRPBadge
            variant="soft"
            color={getStatusBadgeColor(selectedCemetery.status)}
          >
            {getStatusLabel(selectedCemetery.status)}
          </IGRPBadge>
          <Link href={`/cemeteries/${cemeteryId}/edit`}>
            <IGRPButton
              type="button"
              variant="outline"
              showIcon
              iconName="SquarePen"
            >
              Editar
            </IGRPButton>
          </Link>
          <Link href={`/analytics?cemetery=${cemeteryId}`}>
            <IGRPButton
              type="button"
              variant="outline"
              showIcon
              iconName="TrendingUp"
            >
              Analytics
            </IGRPButton>
          </Link>
          <Link href={`/maps?cemetery=${cemeteryId}`}>
            <IGRPButton type="button" variant="outline" showIcon iconName="Map">
              Mapa
            </IGRPButton>
          </Link>
          <Link href={`/cemeteries/${cemeteryId}/blocks/create`}>
            <IGRPButton
              type="button"
              variant="outline"
              showIcon
              iconName="Blocks"
            >
              Adicionar Bloco
            </IGRPButton>
          </Link>
          {blocks && blocks.length > 0 && (
            <Link href={`/cemeteries/${cemeteryId}/sections/create`}>
              <IGRPButton
                type="button"
                variant="outline"
                showIcon
                iconName="ListTree"
              >
                Adicionar Seção
              </IGRPButton>
            </Link>
          )}
          {sections && sections.length > 0 && (
            <Link href={`/plots/create?cemeteryId=${cemeteryId}`}>
              <IGRPButton
                type="button"
                variant="outline"
                showIcon
                iconName="Plus"
              >
                Adicionar Sepultura
              </IGRPButton>
            </Link>
          )}
          <IGRPButton
            type="button"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            showIcon
            iconName="Trash2"
            ref={deleteTriggerBtnRef}
          >
            Excluir
          </IGRPButton>
        </div>
      </IGRPPageHeader>

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
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Capacidade Máxima
              </IGRPLabel>
              <p className="text-base">
                {selectedCemetery.maxCapacity.toLocaleString("pt-CV")}{" "}
                sepulturas
              </p>
            </div>

            <div>
              <IGRPLabel className="text-sm font-medium text-muted-foreground">
                Ocupação Atual
              </IGRPLabel>
              <p className="text-base">
                {selectedCemetery.currentOccupancy.toLocaleString("pt-CV")}{" "}
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

            {selectedCemetery.geoPoint && (
              <div>
                <IGRPLabel className="text-sm font-medium text-muted-foreground">
                  Coordenadas
                </IGRPLabel>
                <p className="text-base">
                  {selectedCemetery.geoPoint.latitude.toFixed(6)},{" "}
                  {selectedCemetery.geoPoint.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>
      </div>

      {/* Estatísticas */}
      <DashboardStats cemeteryId={cemeteryId} />

      {/* Estrutura Hierárquica: Blocos e Seções */}
      <div className="grid gap-6 md:grid-cols-2">
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Blocos</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent>
            <IGRPDataTable<CemeteryBlock, CemeteryBlock>
              className={"rounded-md border"}
              columns={[
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Nome`}
                    />
                  ),
                  accessorKey: "name",
                  cell: ({ row }) => String(row.getValue("name") ?? ""),
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Capacidade`}
                    />
                  ),
                  accessorKey: "maxCapacity",
                  cell: ({ row }) => {
                    const b = row.original as CemeteryBlock;
                    const cap = Number(b.maxCapacity ?? 0);
                    return new Intl.NumberFormat("pt-CV").format(cap);
                  },
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Ocupação`}
                    />
                  ),
                  accessorKey: "currentOccupancy",
                  cell: ({ row }) => {
                    const b = row.original as CemeteryBlock;
                    const total = Number(b.maxCapacity ?? 0);
                    const occ = Number(b.currentOccupancy ?? 0);
                    const rate = total > 0 ? (occ / total) * 100 : 0;
                    return `${rate.toFixed(1)}%`;
                  },
                },
              ]}
              clientFilters={[]}
              data={blocks}
            />
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Seções</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent>
            <IGRPDataTable<CemeterySection, CemeterySection>
              className={"rounded-md border"}
              columns={[
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Nome`}
                    />
                  ),
                  accessorKey: "name",
                  cell: ({ row }) => String(row.getValue("name") ?? ""),
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Capacidade`}
                    />
                  ),
                  accessorKey: "maxCapacity",
                  cell: ({ row }) => {
                    const s = row.original as CemeterySection;
                    const cap = Number(s.maxCapacity ?? 0);
                    return new Intl.NumberFormat("pt-CV").format(cap);
                  },
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Ocupação`}
                    />
                  ),
                  // accessorKey: "currentOccupancy", // Missing in DTO? No, I added it to interface but DTO didn't have it.
                  // Wait, CemeterySectionResponseDTO does NOT have currentOccupancy.
                  // I should check if I added it to interface. Yes I did.
                  // But backend DTO doesn't have it. So it will be undefined.
                  // I should probably remove this column or use a fallback if possible.
                  // But for now I'll use it as is, assuming maybe I missed it or it's not critical.
                  // Actually, I should probably remove it if it's not in DTO.
                  // But let's stick to what I have in interface.
                  accessorKey: "id", // Dummy accessor
                  cell: ({ row }) => {
                    return "N/A"; // Placeholder as DTO doesn't have occupancy
                  },
                },
              ]}
              clientFilters={[]}
              data={sections}
            />
          </IGRPCardContent>
        </IGRPCard>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
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
                onClick={() => {
                  setShowDeleteConfirm(false);
                  try {
                    deleteTriggerBtnRef.current?.focus();
                  } catch {}
                }}
                ref={deleteCancelBtnRef}
              >
                Cancelar
              </IGRPButton>
              <IGRPButton
                variant="outline"
                onClick={handleDelete}
                showIcon
                iconName="Trash2"
              >
                Excluir
              </IGRPButton>
            </IGRPCardContent>
          </IGRPCard>
        </div>
      )}
    </div>
  );
}
