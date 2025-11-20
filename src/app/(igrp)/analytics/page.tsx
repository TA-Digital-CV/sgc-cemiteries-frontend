"use client";

import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useState } from "react";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
// import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "detailed" | "reports" | "projections"
  >("overview");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "overview", label: "Visão Geral", iconName: "BarChart3" },
    { id: "detailed", label: "Análise Detalhada", iconName: "TrendingUp" },
    { id: "reports", label: "Relatórios", iconName: "PieChart" },
    { id: "projections", label: "Projeções", iconName: "Calendar" },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics e Dashboards
          </h1>
          <p className="text-muted-foreground">
            Análise detalhada de métricas, tendências e projeções do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <IGRPButton
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            showIcon
            iconName={"RefreshCw"}
          >
            Atualizar
          </IGRPButton>
          <IGRPButton showIcon iconName={"Download"}>
            Exportar Dados
          </IGRPButton>
          <Link href="/analytics/occupancy">
            <IGRPButton showIcon iconName={"BarChart3"}>
              Ocupação
            </IGRPButton>
          </Link>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "overview" | "detailed" | "reports" | "projections",
                )
              }
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              <IGRPIcon iconName={tab.iconName} className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo por aba */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Métricas principais */}
            <DashboardMetrics />

            {/* Visão geral rápida removida: sem dados simulados */}

            {/* Gráficos rápidos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Ocupação por Tipo</IGRPCardTitle>
                  <IGRPCardDescription>
                    Distribuição de ocupação por tipo de sepultura
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <IGRPIcon
                        iconName="PieChart"
                        className="h-12 w-12 mx-auto mb-2"
                      />
                      <p className="text-sm">
                        Gráfico de ocupação será exibido aqui
                      </p>
                    </div>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Tendências de Receita</IGRPCardTitle>
                  <IGRPCardDescription>
                    Evolução da receita mensal
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <IGRPIcon
                        iconName="TrendingUp"
                        className="h-12 w-12 mx-auto mb-2"
                      />
                      <p className="text-sm">
                        Gráfico de tendências será exibido aqui
                      </p>
                    </div>
                  </div>
                </IGRPCardContent>
              </IGRPCard>
            </div>
          </>
        )}

        {activeTab === "detailed" && <AnalyticsDashboard />}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Relatórios</h2>
                <p className="text-muted-foreground">
                  Gerencie e visualize relatórios detalhados
                </p>
              </div>
              <IGRPButton showIcon iconName={"Plus"}>
                Novo Relatório
              </IGRPButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle className="text-lg">
                    Relatório de Ocupação
                  </IGRPCardTitle>
                  <IGRPCardDescription>
                    Análise detalhada da ocupação
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="flex justify-between items-center">
                    <IGRPBadge color="info">PDF</IGRPBadge>
                    <IGRPButton
                      variant="outline"
                      size="sm"
                      showIcon
                      iconName={"Eye"}
                    >
                      Visualizar
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle className="text-lg">
                    Relatório Financeiro
                  </IGRPCardTitle>
                  <IGRPCardDescription>
                    Análise financeira mensal
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="flex justify-between items-center">
                    <IGRPBadge color="info">CSV</IGRPBadge>
                    <IGRPButton
                      variant="outline"
                      size="sm"
                      showIcon
                      iconName={"Eye"}
                    >
                      Visualizar
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle className="text-lg">
                    Relatório de Manutenção
                  </IGRPCardTitle>
                  <IGRPCardDescription>
                    Status de manutenções
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="flex justify-between items-center">
                    <IGRPBadge color="info">CSV</IGRPBadge>
                    <IGRPButton
                      variant="outline"
                      size="sm"
                      showIcon
                      iconName={"Eye"}
                    >
                      Visualizar
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>
            </div>
          </div>
        )}

        {activeTab === "projections" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Projeções</h2>
                <p className="text-muted-foreground">
                  Análise de projeções futuras e tendências
                </p>
              </div>
              <IGRPButton showIcon iconName={"Calendar"}>
                Atualizar Projeções
              </IGRPButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Projeção de Ocupação</IGRPCardTitle>
                  <IGRPCardDescription>
                    Estimativa de ocupação futura
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <IGRPIcon
                        iconName="TrendingUp"
                        className="h-12 w-12 mx-auto mb-2"
                      />
                      <p className="text-sm">
                        Gráfico de projeção será exibido aqui
                      </p>
                    </div>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Projeção de Receita</IGRPCardTitle>
                  <IGRPCardDescription>
                    Estimativa de receita futura
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <IGRPIcon
                        iconName="DollarSign"
                        className="h-12 w-12 mx-auto mb-2"
                      />
                      <p className="text-sm">
                        Gráfico de projeção será exibido aqui
                      </p>
                    </div>
                  </div>
                </IGRPCardContent>
              </IGRPCard>
            </div>

            <IGRPCard>
              <IGRPCardHeader>
                <IGRPCardTitle>Alertas e Recomendações</IGRPCardTitle>
                <IGRPCardDescription>
                  Alertas baseados nas projeções
                </IGRPCardDescription>
              </IGRPCardHeader>
              <IGRPCardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <IGRPIcon
                      iconName="AlertTriangle"
                      className="h-4 w-4 text-yellow-600 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        Capacidade se aproximando do limite
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Com base nas projeções atuais, a capacidade máxima será
                        atingida em aproximadamente 18 meses.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <IGRPIcon
                      iconName="CheckCircle"
                      className="h-4 w-4 text-green-600 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">Crescimento estável</p>
                      <p className="text-sm text-gray-600 mt-1">
                        A taxa de crescimento está dentro dos padrões esperados
                        para o setor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <IGRPIcon
                      iconName="Users"
                      className="h-4 w-4 text-blue-600 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        Recomendação de expansão
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Considere planejar a expansão de novas áreas dentro dos
                        próximos 12 meses.
                      </p>
                    </div>
                  </div>
                </div>
              </IGRPCardContent>
            </IGRPCard>
          </div>
        )}
      </div>
    </div>
  );
}
