"use client";

import type { IGRPDataTableActionDropdown } from "@igrp/igrp-framework-react-design-system";
import {
  cn,
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPDataTable,
  IGRPDataTableButtonLink,
  IGRPDataTableCellBadge,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuAlert,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPIcon,
  IGRPInputText,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import { CemeteryService } from "@/app/(myapp)/services/cemeteryService";
import type { Cemetery, CemeteryFilters } from "@/app/(myapp)/types/cemetery";

interface CemeteryListProps {
  className?: string;
  municipalityId?: string;
  onMunicipalityChange?: (id: string) => void;
  onCemeterySelect?: (cemetery: Cemetery) => void;
  onCemeteryEdit?: (cemetery: Cemetery) => void;
  onCemeteryDelete?: (cemetery: Cemetery) => void;
}

export function CemeteryList({
  className,
  municipalityId,
  onMunicipalityChange: _onMunicipalityChange,
  onCemeterySelect,
  onCemeteryEdit,
  onCemeteryDelete: _onCemeteryDelete,
}: CemeteryListProps) {
  /**
   * CemeteryList
   * Renders list and requires municipalityId filter to fetch data.
   */
  const {
    cemeteries,
    isLoading,
    error,
    fetchCemeteries,
    deleteCemetery,
    getStatusBadgeColor,
    getStatusLabel,
  } = useCemetery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, _setFilters] = useState<CemeteryFilters>({});
  const [countsById, setCountsById] = useState<
    Record<string, { blocks: number; sections: number; plots: number }>
  >({});
  const { igrpToast } = useIGRPToast();
  const router = useRouter();
  const perms = String(process.env.NEXT_PUBLIC_PERMISSIONS || "")
    .split(",")
    .map((p) => p.trim().toUpperCase());
  const _canWriteStructure = perms.includes("CEMETERY_WRITE");
  const _canWritePlots = perms.includes("PLOTS_WRITE");
  const cemeteryService = useMemo(() => new CemeteryService(), []);

  // Map IGRPBadge colors to Tailwind classes for DataTable
  const badgeColorMap: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    secondary: "text-gray-800 bg-gray-100",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    _setFilters((prev) => {
      const next = { ...prev } as CemeteryFilters;
      if (municipalityId) {
        next.municipalityId = municipalityId;
      } else {
        delete next.municipalityId;
      }
      return next;
    });
  }, [municipalityId]);

  useEffect(() => {
    fetchCemeteries(filters);
  }, [filters, fetchCemeteries]);

  // Toast notification on error changes
  useEffect(() => {
    if (error) {
      igrpToast({
        title: "Erro",
        description: String(error),
        type: "error",
      });
    }
  }, [error, igrpToast]);

  useEffect(() => {
    const loadCounts = async () => {
      const ids = cemeteries.map((c) => c.id);
      for (const id of ids) {
        if (!countsById[id]) {
          try {
            const s = await cemeteryService.getCemeteryStructureSummary(id);
            setCountsById((prev) => ({
              ...prev,
              [id]: {
                blocks: s.totalBlocks,
                sections: s.totalSections,
                plots: s.totalPlots,
              },
            }));
          } catch {}
        }
      }
    };
    if (cemeteries.length) void loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cemeteries, cemeteryService, countsById]);

  // Filtrar cemitérios por termo de busca
  /**
   * Filters cemeteries by name or address string.
   * Cemetery.address is a string, not a structured object.
   */
  const filteredCemeteries = cemeteries.filter((cemetery) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      cemetery.name.toLowerCase().includes(term) ||
      (cemetery.address?.toLowerCase?.().includes(term) ?? false);
    const matchesMunicipality = municipalityId
      ? String(cemetery.municipalityId ?? "") === String(municipalityId)
      : true;
    return matchesSearch && matchesMunicipality;
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const _handleViewDetails = (cemetery: Cemetery) => {
    onCemeterySelect?.(cemetery);
  };

  const _handleEdit = (cemetery: Cemetery) => {
    onCemeteryEdit?.(cemetery);
  };

  const handleDelete = async (cemetery: Cemetery) => {
    if (
      confirm(`Tem certeza que deseja excluir o cemitério "${cemetery.name}"?`)
    ) {
      try {
        await deleteCemetery(cemetery.id);
        // Recarregar lista após exclusão
        fetchCemeteries(filters);
        igrpToast({
          title: "Sucesso",
          description: "Cemitério excluído com sucesso",
          type: "success",
        });
      } catch (error) {
        console.error("Erro ao excluir cemitério:", error);
        igrpToast({
          title: "Erro",
          description: "Erro ao excluir cemitério. Por favor, tente novamente.",
          type: "error",
        });
      }
    }
  };

  const _hasBlocks = (cemeteryId: string) =>
    Boolean(countsById[cemeteryId]?.blocks);
  const _hasSections = (cemeteryId: string) =>
    Boolean(countsById[cemeteryId]?.sections);

  // Status badge mapping consolidated: use getStatusBadgeProps with IGRPDataTableCellBadge

  const getOccupancyBadge = (rate: number) => {
    if (rate >= 90)
      return (
        <IGRPBadge color="secondary" variant="soft" size="sm">
          Crítico
        </IGRPBadge>
      );
    if (rate >= 80)
      return (
        <IGRPBadge color="warning" variant="soft" size="sm">
          Alto
        </IGRPBadge>
      );
    if (rate >= 60)
      return (
        <IGRPBadge color="info" variant="soft" size="sm">
          Médio
        </IGRPBadge>
      );
    return (
      <IGRPBadge color="success" variant="soft" size="sm">
        Baixo
      </IGRPBadge>
    );
  };

  if (error) {
    return (
      <IGRPCard className={className}>
        <IGRPCardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-medium">
              Erro ao carregar cemitérios
            </p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              onClick={() => fetchCemeteries(filters)}
              iconName={"Refresh"}
              className={"mt-4"}
            >
              Tentar novamente
            </IGRPButton>
          </div>
        </IGRPCardContent>
      </IGRPCard>
    );
  }

  return (
    <IGRPCard className={className}>
      <IGRPCardContent>
        <IGRPCard>
          <IGRPCardContent>
            {/* Barra de busca e filtros */}
            <div className="flex space-x-4 mb-6">
              <div className="relative flex-1">
                <IGRPInputText
                  placeholder="Buscar cemitério por nome, cidade ou estado..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                  iconName={"Search"}
                  showIcon={true}
                />
              </div>

              <IGRPButton
                variant={"outline"}
                size={"sm"}
                showIcon={true}
                iconName={"Funnel"}
                className={cn()}
              >
                Filtros
              </IGRPButton>
            </div>
          </IGRPCardContent>
        </IGRPCard>

        {/* Tabela de cemitérios - IGRPDataTable */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <IGRPIcon
              iconName="RefreshCw"
              className="h-6 w-6 animate-spin text-gray-400"
            />
            <span className="ml-2 text-gray-500">Carregando cemitérios...</span>
          </div>
        )}

        {!isLoading && filteredCemeteries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <IGRPIcon
              iconName="MapPin"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="font-medium">Nenhum cemitério encontrado</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Comece cadastrando um novo cemitério"}
            </p>
          </div>
        )}

        {!isLoading && filteredCemeteries.length > 0 && (
          <IGRPDataTable<Cemetery, Cemetery>
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
                cell: ({ row }) => row.getValue("name") as string,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Localização`}
                  />
                ),
                accessorKey: "address",
                cell: ({ row }) => row.getValue("address") as string,
              },
              {
                id: "blocksCount",
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Blocos`}
                  />
                ),
                accessorKey: "id", // blocksCount not in DTO
                cell: ({ row }) => {
                  const id = (row.original as Cemetery).id;
                  const v = countsById[id]?.blocks ?? 0;
                  return new Intl.NumberFormat("pt-CV").format(v);
                },
              },
              {
                id: "sectionsCount",
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Seções`}
                  />
                ),
                accessorKey: "id", // sectionsCount not in DTO
                cell: ({ row }) => {
                  const id = (row.original as Cemetery).id;
                  const v = countsById[id]?.sections ?? 0;
                  return new Intl.NumberFormat("pt-CV").format(v);
                },
              },
              {
                id: "plotsCount",
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Sepulturas`}
                  />
                ),
                accessorKey: "id", // plotsCount not in DTO
                cell: ({ row }) => {
                  const id = (row.original as Cemetery).id;
                  const v = countsById[id]?.plots ?? 0;
                  return new Intl.NumberFormat("pt-CV").format(v);
                },
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Total Sep.`}
                  />
                ),
                accessorKey: "maxCapacity",
                cell: ({ row }) => {
                  const value = Number(row.getValue("maxCapacity") ?? 0);
                  return new Intl.NumberFormat("pt-CV").format(value);
                },
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Ocupação`}
                  />
                ),
                accessorKey: "occupancyRate",
                cell: ({ row }) => {
                  const rate = Number(row.getValue("occupancyRate") ?? 0);
                  return (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium">
                        {rate.toFixed(1)}%
                      </span>
                      {getOccupancyBadge(rate)}
                    </div>
                  );
                },
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Status`}
                  />
                ),
                accessorKey: "status",
                cell: ({ row }) => {
                  const status = String(row.getValue("status") ?? "");
                  const label = getStatusLabel(status);
                  const color = getStatusBadgeColor(status);
                  const badgeClassName = badgeColorMap[color] || "";
                  return (
                    <IGRPDataTableCellBadge
                      label={label}
                      variant={`soft`}
                      badgeClassName={badgeClassName}
                    />
                  );
                },
              },
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  const rowData = row.original as Cemetery;
                  const items: IGRPDataTableActionDropdown[] = [
                    {
                      component: IGRPDataTableDropdownMenuLink,
                      props: {
                        labelTrigger: `Editar`,
                        icon: `SquarePen`,
                        href: `/cemeteries/${rowData.id}/edit`,
                        showIcon: true,
                      },
                    },
                  ];
                  // Navegação de gestão respeitando hierarquia com persistência de contexto
                  items.push({
                    component: IGRPDataTableDropdownMenuAlert,
                    props: {
                      modalTitle: `Gerir Blocos`,
                      labelTrigger: `Gerir Blocos`,
                      icon: `Blocks`,
                      showIcon: true,
                      showCancel: true,
                      labelCancel: `Cancelar`,
                      variantCancel: `default` as const,
                      showConfirm: true,
                      labelConfirm: `Confirmar`,
                      variantConfirm: `secondary` as const,
                      onClickConfirm: () => {
                        try {
                          localStorage.setItem(
                            "activeCemeteryId",
                            String(rowData.id),
                          );
                          router.push(`/blocks?cemeteryId=${rowData.id}`);
                        } catch {}
                      },
                      children: <></>,
                    },
                  });
                  items.push({
                    component: IGRPDataTableDropdownMenuAlert,
                    props: {
                      modalTitle: `Gerir Seções`,
                      labelTrigger: `Gerir Seções`,
                      icon: `ListTree`,
                      showIcon: true,
                      showCancel: true,
                      labelCancel: `Cancelar`,
                      variantCancel: `default` as const,
                      showConfirm: true,
                      labelConfirm: `Confirmar`,
                      variantConfirm: `secondary` as const,
                      onClickConfirm: () => {
                        try {
                          localStorage.setItem(
                            "activeCemeteryId",
                            String(rowData.id),
                          );
                          router.push(`/sections?cemeteryId=${rowData.id}`);
                        } catch {}
                      },
                      children: <></>,
                    },
                  });
                  items.push({
                    component: IGRPDataTableDropdownMenuAlert,
                    props: {
                      modalTitle: `Gerir Sepulturas`,
                      labelTrigger: `Gerir Sepulturas`,
                      icon: `Crosshair`,
                      showIcon: true,
                      showCancel: false,
                      showConfirm: false,
                      onClickConfirm: () => {
                        try {
                          localStorage.setItem(
                            "activeCemeteryId",
                            String(rowData.id),
                          );
                          router.push(`/plots?cemeteryId=${rowData.id}`);
                        } catch {}
                      },
                      children: <></>,
                    },
                  });
                  items.push({
                    component: IGRPDataTableDropdownMenuAlert,
                    props: {
                      modalTitle: `Excluir`,
                      labelTrigger: `Excluir`,
                      icon: `Trash`,
                      showIcon: true,
                      showCancel: true,
                      labelCancel: `Cancel`,
                      variantCancel: `default` as const,
                      showConfirm: true,
                      labelConfirm: `Confirm`,
                      variantConfirm: `destructive` as const,
                      onClickConfirm: () => {
                        void handleDelete(rowData);
                      },
                      children: <>Deseja excluir o cemitério?</>,
                    },
                  });
                  return (
                    <IGRPDataTableRowAction>
                      <IGRPDataTableButtonLink
                        labelTrigger={`Detalhes`}
                        href={`/cemeteries/${rowData.id}`}
                        variant={`ghost`}
                        icon={`Eye`}
                      ></IGRPDataTableButtonLink>
                      <IGRPDataTableDropdownMenu
                        items={items}
                      ></IGRPDataTableDropdownMenu>
                    </IGRPDataTableRowAction>
                  );
                },
              },
            ]}
            clientFilters={[]}
            data={filteredCemeteries}
          />
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
