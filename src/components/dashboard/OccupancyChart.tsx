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
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface OccupancyChartProps {
  className?: string;
  data: {
    occupied: number;
    available: number;
    reserved: number;
    maintenance: number;
  };
  isLoading?: boolean;
}

export function OccupancyChart({
  className,
  data,
  isLoading,
}: OccupancyChartProps) {
  if (isLoading) {
    return (
      <IGRPCard className={className}>
        <IGRPCardHeader>
          <IGRPCardTitle>Distribuição de Ocupação</IGRPCardTitle>
          <IGRPCardDescription>
            Status das sepulturas no sistema
          </IGRPCardDescription>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded" />
        </IGRPCardContent>
      </IGRPCard>
    );
  }

  const chartData = [
    { name: "Disponível", value: data.available, color: "#22c55e" }, // green-500
    { name: "Ocupado", value: data.occupied, color: "#ef4444" }, // red-500
    { name: "Reservado", value: data.reserved, color: "#f97316" }, // orange-500
    { name: "Manutenção", value: data.maintenance, color: "#eab308" }, // yellow-500
  ].filter((item) => item.value > 0);

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <IGRPCardTitle>Distribuição de Ocupação</IGRPCardTitle>
        <IGRPCardDescription>
          Status das sepulturas no sistema
        </IGRPCardDescription>
      </IGRPCardHeader>
      <IGRPCardContent className="pl-2">
        {chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Sem dados para exibir
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value} Sepulturas`,
                    "Quantidade",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
