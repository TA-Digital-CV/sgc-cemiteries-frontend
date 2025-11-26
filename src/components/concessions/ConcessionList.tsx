"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPDataTable,
  IGRPDataTableButtonLink,
  IGRPDataTableCellBadge,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPIcon,
  IGRPInputText,
} from "@igrp/igrp-framework-react-design-system";
import React, { useEffect, useState } from "react";
import { useConcession } from "@/app/(myapp)/hooks/useConcession";
import type { Concession } from "@/app/(myapp)/types/Concession";

export function ConcessionList() {
  const { concessions, isLoading, error, fetchConcessions } = useConcession();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConcessions();
  }, [fetchConcessions]);

  const filteredConcessions = concessions.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.holder.name.toLowerCase().includes(term) ||
      c.holder.document.includes(term)
    );
  });

  if (error) {
    return (
      <IGRPCard>
        <IGRPCardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-medium">
              Erro ao carregar concessões
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              onClick={() => fetchConcessions()}
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
    <IGRPCard>
      <IGRPCardContent>
        <IGRPCard>
          <IGRPCardContent>
            <div className="flex space-x-4 mb-6">
              <div className="relative flex-1">
                <IGRPInputText
                  placeholder="Buscar concessão por titular ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  iconName={"Search"}
                  showIcon={true}
                />
              </div>
              <IGRPButton
                variant={"default"}
                size={"sm"}
                showIcon={true}
                iconName={"Plus"}
                className={""}
                // onClick={() => {}} // TODO: Navigate to create page or open modal
              >
                Nova Concessão
              </IGRPButton>
            </div>
          </IGRPCardContent>
        </IGRPCard>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <IGRPIcon
              iconName="RefreshCw"
              className="h-6 w-6 animate-spin text-gray-400"
            />
            <span className="ml-2 text-gray-500">Carregando concessões...</span>
          </div>
        )}

        {!isLoading && filteredConcessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <IGRPIcon
              iconName="FileText"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="font-medium">Nenhuma concessão encontrada</p>
          </div>
        )}

        {!isLoading && filteredConcessions.length > 0 && (
          <IGRPDataTable<Concession, Concession>
            className={"rounded-md border"}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Titular`}
                  />
                ),
                accessorKey: "holder.name",
                cell: ({ row }) => row.original.holder.name,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Documento`}
                  />
                ),
                accessorKey: "holder.document",
                cell: ({ row }) => row.original.holder.document,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Tipo`}
                  />
                ),
                accessorKey: "typeId", // Assuming typeId maps to a readable type or we fetch it
                cell: ({ row }) => row.original.type, // Placeholder
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
                  const status = row.original.status || "ACTIVE"; // Default to ACTIVE if undefined
                  return (
                    <IGRPDataTableCellBadge
                      label={status}
                      variant={`soft`}
                      badgeClassName={
                        status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    />
                  );
                },
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Data Início`}
                  />
                ),
                accessorKey: "startDate",
                cell: ({ row }) =>
                  row.original.startDate
                    ? new Date(row.original.startDate).toLocaleDateString()
                    : "-",
              },
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  const rowData = row.original;
                  return (
                    <IGRPDataTableRowAction>
                      <IGRPDataTableButtonLink
                        labelTrigger={`Detalhes`}
                        href={`/concessions/${rowData.id}`}
                        variant={`ghost`}
                        icon={`Eye`}
                      ></IGRPDataTableButtonLink>
                      <IGRPDataTableDropdownMenu
                        items={[
                          {
                            component: IGRPDataTableDropdownMenuLink,
                            props: {
                              labelTrigger: `Editar`,
                              icon: `SquarePen`,
                              href: `/concessions/${rowData.id}/edit`,
                              showIcon: true,
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
            data={filteredConcessions}
          />
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
