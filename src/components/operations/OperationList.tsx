"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPDataTable,
  IGRPDataTableButtonLink,
  IGRPDataTableCellBadge,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuAlert,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import React, { useEffect } from "react";
import { useOperation } from "@/app/(myapp)/hooks/useOperation";
import type { Operation } from "@/app/(myapp)/types/Operation";

export function OperationList() {
  const {
    operations,
    isLoading,
    error,
    fetchOperations,
    updateOperationStatus,
  } = useOperation();

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOperationStatus(id, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <IGRPCard>
        <IGRPCardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-medium">
              Erro ao carregar operações
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              onClick={() => fetchOperations()}
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
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <IGRPIcon
              iconName="RefreshCw"
              className="h-6 w-6 animate-spin text-gray-400"
            />
            <span className="ml-2 text-gray-500">Carregando operações...</span>
          </div>
        )}

        {!isLoading && operations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <IGRPIcon
              iconName="Activity"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="font-medium">Nenhuma operação encontrada</p>
          </div>
        )}

        {!isLoading && operations.length > 0 && (
          <IGRPDataTable<Operation, Operation>
            className={"rounded-md border"}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Número`}
                  />
                ),
                accessorKey: "number",
                cell: ({ row }) => row.original.number,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Tipo`}
                  />
                ),
                accessorKey: "type",
                cell: ({ row }) => row.original.type,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Data`}
                  />
                ),
                accessorKey: "scheduledDate",
                cell: ({ row }) =>
                  new Date(row.original.scheduledDate).toLocaleDateString(),
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
                  const status = row.original.status;
                  let variant = "default";
                  let badgeClass = "";

                  switch (status) {
                    case "COMPLETED":
                      variant = "success";
                      badgeClass = "bg-green-100 text-green-800";
                      break;
                    case "PENDING":
                      variant = "warning";
                      badgeClass = "bg-yellow-100 text-yellow-800";
                      break;
                    default:
                      badgeClass = "bg-gray-100 text-gray-800";
                  }

                  return (
                    <IGRPDataTableCellBadge
                      label={status}
                      variant={"soft"}
                      badgeClassName={badgeClass}
                    />
                  );
                },
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
                        href={`/operations/${rowData.id}`}
                        variant={`ghost`}
                        icon={`Eye`}
                      ></IGRPDataTableButtonLink>
                      <IGRPDataTableDropdownMenu
                        items={
                          [
                            rowData.status === "PENDING"
                              ? {
                                  component: IGRPDataTableDropdownMenuAlert,
                                  props: {
                                    modalTitle: "Iniciar Operação",
                                    labelTrigger: "Iniciar",
                                    icon: "Play",
                                    showIcon: true,
                                    showCancel: true,
                                    labelCancel: "Cancelar",
                                    showConfirm: true,
                                    labelConfirm: "Confirmar",
                                    onClickConfirm: () =>
                                      handleStatusChange(
                                        rowData.id,
                                        "IN_PROGRESS",
                                      ),
                                    children: (
                                      <>
                                        Deseja iniciar a operação{" "}
                                        {rowData.number}?
                                      </>
                                    ),
                                  },
                                }
                              : null,
                            rowData.status === "IN_PROGRESS"
                              ? {
                                  component: IGRPDataTableDropdownMenuAlert,
                                  props: {
                                    modalTitle: "Concluir Operação",
                                    labelTrigger: "Concluir",
                                    icon: "CheckCircle",
                                    showIcon: true,
                                    showCancel: true,
                                    labelCancel: "Cancelar",
                                    showConfirm: true,
                                    labelConfirm: "Confirmar",
                                    onClickConfirm: () =>
                                      handleStatusChange(
                                        rowData.id,
                                        "COMPLETED",
                                      ),
                                    children: (
                                      <>
                                        Deseja concluir a operação{" "}
                                        {rowData.number}?
                                      </>
                                    ),
                                  },
                                }
                              : null,
                          ].filter(Boolean) as any
                        }
                      ></IGRPDataTableDropdownMenu>
                    </IGRPDataTableRowAction>
                  );
                },
              },
            ]}
            clientFilters={[]}
            data={operations}
          />
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
