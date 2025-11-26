"use client";

import { IGRPStatsCard } from "@igrp/igrp-framework-react-design-system";
import React from "react";

export function FinancialDashboard() {
  // In a real scenario, we would fetch summary data here
  const summary = {
    totalRevenue: 150000,
    pendingPayments: 45000,
    overduePayments: 12000,
    reconciled: 98,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <IGRPStatsCard
        name="total-revenue"
        title="Receita Total"
        value={new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(summary.totalRevenue)}
        cardVariant="success"
        iconName="DollarSign"
        showIcon={true}
        iconVariant="success"
        iconBackground="square"
        showIconBackground={true}
        cardBorder="rounded-xl"
        cardBorderPosition="top"
      />

      <IGRPStatsCard
        name="pending-payments"
        title="Pagamentos Pendentes"
        value={new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(summary.pendingPayments)}
        cardVariant="warning"
        iconName="Clock"
        showIcon={true}
        iconVariant="warning"
        iconBackground="square"
        showIconBackground={true}
        cardBorder="rounded-xl"
        cardBorderPosition="top"
      />

      <IGRPStatsCard
        name="overdue-payments"
        title="Inadimplência"
        value={new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(summary.overduePayments)}
        cardVariant="destructive"
        iconName="AlertCircle"
        showIcon={true}
        iconVariant="destructive"
        iconBackground="square"
        showIconBackground={true}
        cardBorder="rounded-xl"
        cardBorderPosition="top"
      />

      <IGRPStatsCard
        name="reconciled"
        title="Conciliação"
        value={`${summary.reconciled}%`}
        cardVariant="info"
        iconName="CheckCircle"
        showIcon={true}
        iconVariant="info"
        iconBackground="square"
        showIconBackground={true}
        cardBorder="rounded-xl"
        cardBorderPosition="top"
      />
    </div>
  );
}
