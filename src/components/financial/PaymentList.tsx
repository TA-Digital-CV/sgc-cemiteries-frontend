"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPDataTable,
  IGRPDataTableButtonLink,
  IGRPDataTableCellBadge,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import React, { useEffect } from "react";
import { useFinancial } from "@/app/(myapp)/hooks/useFinancial";
import type { Payment } from "@/app/(myapp)/types/Financial";

export function PaymentList() {
  const { payments, isLoading, error, fetchPayments } = useFinancial();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (error) {
    return (
      <IGRPCard>
        <IGRPCardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-medium">
              Erro ao carregar pagamentos
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              onClick={() => fetchPayments()}
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
            <span className="ml-2 text-gray-500">Carregando pagamentos...</span>
          </div>
        )}

        {!isLoading && payments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <IGRPIcon
              iconName="CreditCard"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="font-medium">Nenhum pagamento encontrado</p>
          </div>
        )}

        {!isLoading && payments.length > 0 && (
          <IGRPDataTable<Payment, Payment>
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
                    title={`Pagador`}
                  />
                ),
                accessorKey: "payer.name",
                cell: ({ row }) => (
                  <div>
                    <div className="font-medium">{row.original.payer.name}</div>
                    <div className="text-xs text-gray-500">
                      {row.original.payer.document}
                    </div>
                  </div>
                ),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Vencimento`}
                  />
                ),
                accessorKey: "dueDate",
                cell: ({ row }) =>
                  new Date(row.original.dueDate).toLocaleDateString(),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Valor`}
                  />
                ),
                accessorKey: "amount",
                cell: ({ row }) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(row.original.amount),
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
                    case "PAID":
                      variant = "success";
                      badgeClass = "bg-green-100 text-green-800";
                      break;
                    case "OVERDUE":
                      variant = "destructive";
                      badgeClass = "bg-red-100 text-red-800";
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
                        href={`/financial/payments/${rowData.id}`}
                        variant={`ghost`}
                        icon={`Eye`}
                      ></IGRPDataTableButtonLink>
                    </IGRPDataTableRowAction>
                  );
                },
              },
            ]}
            clientFilters={[]}
            data={payments}
          />
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
