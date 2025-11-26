"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPDataTable,
  IGRPDataTableCellBadge,
  IGRPDataTableHeaderSortToggle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import React, { useEffect } from "react";
import { useFinancial } from "@/app/(myapp)/hooks/useFinancial";
import type { FeeTable } from "@/app/(myapp)/types/Financial";

export function FeeTableList() {
  const { feeTables, isLoading, error, fetchFeeTables } = useFinancial();

  useEffect(() => {
    fetchFeeTables();
  }, [fetchFeeTables]);

  if (error) {
    return (
      <IGRPCard>
        <IGRPCardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-medium">Erro ao carregar taxas</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              onClick={() => fetchFeeTables()}
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
            <span className="ml-2 text-gray-500">Carregando taxas...</span>
          </div>
        )}

        {!isLoading && feeTables.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <IGRPIcon
              iconName="List"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="font-medium">Nenhuma taxa encontrada</p>
          </div>
        )}

        {!isLoading && feeTables.length > 0 && (
          <IGRPDataTable<FeeTable, FeeTable>
            className={"rounded-md border"}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Código`}
                  />
                ),
                accessorKey: "code",
                cell: ({ row }) => (
                  <span className="font-medium">{row.original.code}</span>
                ),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Descrição`}
                  />
                ),
                accessorKey: "description",
                cell: ({ row }) => row.original.description,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Valor`}
                  />
                ),
                accessorKey: "value",
                cell: ({ row }) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(row.original.value),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Categoria`}
                  />
                ),
                accessorKey: "category",
                cell: ({ row }) => row.original.category,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Status`}
                  />
                ),
                accessorKey: "active",
                cell: ({ row }) => (
                  <IGRPDataTableCellBadge
                    label={row.original.active ? "Ativo" : "Inativo"}
                    variant={"soft"}
                    badgeClassName={
                      row.original.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  />
                ),
              },
            ]}
            clientFilters={[]}
            data={feeTables}
          />
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
