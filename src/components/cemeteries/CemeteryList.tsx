"use client";

import {
  cn,
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
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
} from "@igrp/igrp-framework-react-design-system";
import { useEffect, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import type { Cemetery, CemeteryFilters } from "@/types/cemetery";

interface CemeteryListProps {
  className?: string;
  onCemeterySelect?: (cemetery: Cemetery) => void;
  onCemeteryEdit?: (cemetery: Cemetery) => void;
  onCemeteryDelete?: (cemetery: Cemetery) => void;
}

export function CemeteryList({
  className,
  onCemeterySelect,
  onCemeteryEdit,
  onCemeteryDelete,
}: CemeteryListProps) {
  /**
   * CemeteryList renders a paginated table of cemeteries.
   * Provides search, status/occupancy badges, and row actions.
   */
  const { cemeteries, isLoading, error, fetchCemeteries, deleteCemetery } =
    useCemetery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<CemeteryFilters>({});
  /**
   * Maps CemeteryStatus to label and style classes for DataTable badges.
   */
  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          label: "Ativo",
          badgeClassName: "bg-green-100 text-green-800",
        };
      case "INACTIVE":
        return {
          label: "Inativo",
          badgeClassName: "text-gray-800 bg-gray-100",
        };
      case "MAINTENANCE":
        return {
          label: "Manutenção",
          badgeClassName: "bg-yellow-100 text-yellow-800",
        };
      case "full":
        return { label: "Lotado", badgeClassName: "bg-red-100 text-red-800" };
      default:
        return { label: status, badgeClassName: "" };
    }
  };

  useEffect(() => {
    fetchCemeteries(filters);
  }, [filters, fetchCemeteries]);

  // Filtrar cemitérios por termo de busca
  /**
   * Filters cemeteries by name or address string.
   * Cemetery.address is a string, not a structured object.
   */
  const filteredCemeteries = cemeteries.filter((cemetery) => {
    const term = searchTerm.toLowerCase();
    return (
      cemetery.name.toLowerCase().includes(term) ||
      (cemetery.address?.toLowerCase?.().includes(term) ?? false)
    );
  });

  // Paginação
  /* const totalPages = Math.ceil(filteredCemeteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCemeteries = filteredCemeteries.slice(
    startIndex,
    startIndex + itemsPerPage,
  );*/

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleViewDetails = (cemetery: Cemetery) => {
    onCemeterySelect?.(cemetery);
  };

  const handleEdit = (cemetery: Cemetery) => {
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
      } catch (error) {
        console.error("Erro ao excluir cemitério:", error);
        alert("Erro ao excluir cemitério. Por favor, tente novamente.");
      }
    }
  };

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
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle>Lista de Cemitérios</IGRPCardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <IGRPButton 
              variant={"outline"}
              size={"sm"}
              showIcon={true}
              iconName={"Download"}
              className={cn()}
            >
              Exportar
            </IGRPButton>
            <IGRPButton 
              variant={"default"}
              size={"sm"}
              showIcon={true}
              iconName={"Plus"}
              className={cn()}
            >
              Novo Cemitério
            </IGRPButton>
          </div>
        </div>
      </IGRPCardHeader>
      <IGRPCardContent>
        {/* Barra de busca e filtros */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <IGRPIcon
              iconName="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            />
            <IGRPInputText
              placeholder="Buscar cemitério por nome, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <IGRPButton 
            variant={"outline"}
            size={"sm"}
            showIcon={true}
            iconName={"Filter2"}
            className={cn()}
          >
            Filtros
          </IGRPButton>
        </div>

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
                  const { label, badgeClassName } = getStatusBadgeProps(status);
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
                  return (
                    <IGRPDataTableRowAction>
                      <IGRPDataTableButtonLink
                        labelTrigger={`Editar`}
                        href={`/cemeteries/${rowData.id}/edit`}
                        variant={`ghost`}
                        icon={`SquarePen`}
                      ></IGRPDataTableButtonLink>
                      <IGRPDataTableDropdownMenu
                        items={[
                          {
                            component: IGRPDataTableDropdownMenuLink,
                            props: {
                              labelTrigger: `Detalhes`,
                              icon: `Eye`,
                              href: `/cemeteries/${rowData.id}`,
                              showIcon: true,
                            },
                          },
                          {
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
                          },
                        ]}
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
