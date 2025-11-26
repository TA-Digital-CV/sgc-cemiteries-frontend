"use client";

import React from "react";
import {
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
} from "@igrp/igrp-framework-react-design-system";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OperationsChartProps {
  className?: string;
  data: {
    burials: number;
    exhumations: number;
    transfers: number;
  };
  isLoading?: boolean;
}

export function OperationsChart({
  className,
  data,
  isLoading,
}: OperationsChartProps) {
  const chartData = [
    { name: "Inumações", value: data.burials, color: "#3b82f6" }, // blue-500
    { name: "Exumações", value: data.exhumations, color: "#8b5cf6" }, // violet-500
    { name: "Traslados", value: data.transfers, color: "#ec4899" }, // pink-500
  ];

  if (isLoading) {
    return (
      <IGRPCard className={className}>
        <IGRPCardHeader>
          <IGRPCardTitle>Operações Recentes</IGRPCardTitle>
          <IGRPCardDescription>Movimentações no período</IGRPCardDescription>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded" />
        </IGRPCardContent>
      </IGRPCard>
    );
  }

  const hasData = chartData.some((item) => item.value > 0);

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <IGRPCardTitle>Operações Recentes</IGRPCardTitle>
        <IGRPCardDescription>Movimentações no período</IGRPCardDescription>
      </IGRPCardHeader>
      <IGRPCardContent className="pl-2">
        {!hasData ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Sem dados de operações
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
