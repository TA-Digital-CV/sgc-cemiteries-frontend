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
  IGRPPageHeader,
} from "@igrp/igrp-framework-react-design-system";
import type { Map } from "maplibre-gl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import { useMap } from "@/app/(myapp)/hooks/useMap";
import type {
  CemeteryBlock,
  CemeterySection,
} from "@/app/(myapp)/types/cemetery";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import CemeteryMap from "@/components/cemeteries/CemeteryMap";

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
  const mapInstanceRef = useRef<Map | null>(null);

  const {
    selectCemetery,
    deleteCemetery,
    isLoading,
    error,
    selectedCemetery,
    fetchCemeteryStructures,
    blocks,
    sections,
    getStatusBadgeColor,
    getStatusLabel,
  } = useCemetery({ autoFetch: false });

  const { mapData, fetchMapData } = useMap();

  const [localError, setLocalError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
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
    // Initialize map data
    await fetchMapData(cemeteryId);
    try {
      localStorage.setItem("activeCemeteryId", String(cemeteryId));
    } catch {}
  }, [cemeteryId, selectCemetery, fetchCemeteryStructures, fetchMapData]);

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

  const availableBlocks =
    blocks?.filter((b) => b.occupancyRate < 100).length || 0;
  const totalSections = sections?.length || 0;

  // Render skeletons if loading or if we don't have data yet but no error
  const showSkeleton =
    isLoading || (!selectedCemetery && !error && !localError);

  if (!showSkeleton && (localError || error || !selectedCemetery)) {
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
      {showSkeleton ? (
        <div className="space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <IGRPPageHeader
          name={"pageHeaderCemeteryDetail"}
          iconBackButton={"ArrowLeft"}
          showBackButton={true}
          urlBackButton={`/cemeteries`}
          variant={"h3"}
          title={selectedCemetery!.name}
        >
          <div className="flex flex-wrap gap-2">
            <IGRPBadge
              variant="soft"
              color={
                getStatusBadgeColor(selectedCemetery!.status) as
                  | "indigo"
                  | "warning"
                  | "primary"
                  | "success"
                  | "info"
                  | "destructive"
                  | "secondary"
                  | undefined
              }
            >
              {getStatusLabel(selectedCemetery!.status)}
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
              <IGRPButton
                type="button"
                variant="outline"
                showIcon
                iconName="Map"
              >
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
              <Link href={`/cemeteries/${cemeteryId}/plots/create`}>
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
      )}

      {/* Grid de informações */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações básicas e estatísticas */}
        {showSkeleton ? (
          <IGRPCard>
            <IGRPCardHeader>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
            </IGRPCardHeader>
            <IGRPCardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1" />
                  <div className="h-5 w-full bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </IGRPCardContent>
          </IGRPCard>
        ) : (
          <IGRPCard className="flex flex-col h-full">
            <IGRPCardContent className="space-y-6 flex-1">
              {/* Endereço e Botão Mapa */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="text-lg font-semibold">
                      {selectedCemetery!.address}
                    </p>
                  </div>
                  <IGRPButton
                    variant="outline"
                    size="sm"
                    showIcon
                    iconName="MapPin"
                    onClick={() => {
                      if (
                        selectedCemetery?.geoPoint &&
                        mapInstanceRef.current
                      ) {
                        mapInstanceRef.current.flyTo({
                          center: [
                            selectedCemetery.geoPoint.longitude,
                            selectedCemetery.geoPoint.latitude,
                          ],
                          zoom: 16,
                          essential: true,
                        });
                      }
                    }}
                  >
                    Ver no mapa
                  </IGRPButton>
                </div>
              </div>

              {/* Grid de Estatísticas */}
              <div
                className="grid grid-cols-2 gap-4"
                data-testid="cemetery-basic-stats"
              >
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Capacidade Total
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedCemetery!.maxCapacity.toLocaleString("pt-CV")}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Área Total</p>
                  <p className="text-lg font-semibold">
                    {selectedCemetery!.totalArea.toLocaleString("pt-CV")} m²
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Blocos Disponíveis
                  </p>
                  <p className="text-lg font-semibold">{availableBlocks}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Total de Seções
                  </p>
                  <p className="text-lg font-semibold">{totalSections}</p>
                </div>
              </div>
            </IGRPCardContent>
          </IGRPCard>
        )}

        {/* Componente de Mapa */}
        <CemeteryMap
          selectedCemetery={selectedCemetery}
          mapData={mapData}
          showSkeleton={showSkeleton}
          mapError={mapError}
          setMapError={setMapError}
          onMapInstance={(map) => {
            mapInstanceRef.current = map;
          }}
        />
      </div>

      {/* Estatísticas */}
      <DashboardStats cemeteryId={cemeteryId} />

      {/* Estrutura Hierárquica: Blocos e Seções */}
      <div className="grid gap-6 md:grid-cols-2">
        {showSkeleton ? (
          <IGRPCard>
            <IGRPCardHeader>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="space-y-2">
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
              </div>
            </IGRPCardContent>
          </IGRPCard>
        ) : (
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
        )}

        {showSkeleton ? (
          <IGRPCard>
            <IGRPCardHeader>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="space-y-2">
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
              </div>
            </IGRPCardContent>
          </IGRPCard>
        ) : (
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
                ]}
                clientFilters={[]}
                data={sections}
              />
            </IGRPCardContent>
          </IGRPCard>
        )}
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
