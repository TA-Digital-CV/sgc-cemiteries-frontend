"use client";
import { IGRPButton } from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";
import { QRCodeBatchGenerator } from "@/components/qr-codes/QRCodeBatchGenerator";
import { QRCodeGenerator } from "@/components/qr-codes/QRCodeGenerator";
import { QRCodeScanner } from "@/components/qr-codes/QRCodeScanner";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportTemplates } from "@/components/reports/ReportTemplates";

export default function QRCodesReportsPage() {
  // Handles active tab state between QR codes, scanner, batch, reports and templates
  const [activeTab, setActiveTab] = useState<
    "qrcodes" | "scanner" | "batch" | "reports" | "templates"
  >("qrcodes");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "qrcodes", label: "QR Codes" },
    { id: "scanner", label: "Scanner" },
    { id: "batch", label: "Lote" },
    { id: "reports", label: "Relatórios" },
    { id: "templates", label: "Templates" },
  ];

  /**
   * handleRefresh
   *
   * Triggers a lightweight loading state to represent data refresh.
   */
  const handleRefresh = async (): Promise<void> => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            QR Codes e Relatórios
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de QR Codes e geração de relatórios
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
            {loading ? "Atualizando..." : "Atualizar"}
          </IGRPButton>
          <IGRPButton showIcon iconName={"Plus"}>Novo QR Code</IGRPButton>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo por aba */}
      <div className="space-y-6">
        {activeTab === "qrcodes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gerador de QR Codes</h2>
                <p className="text-muted-foreground">
                  Crie e gerencie QR Codes para sepulturas e áreas
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Download"}>Exportar</IGRPButton>
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Share2"}>Compartilhar</IGRPButton>
              </div>
            </div>

            <QRCodeGenerator />
          </div>
        )}

        {activeTab === "scanner" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Scanner de QR Codes</h2>
                <p className="text-muted-foreground">
                  Escaneie QR Codes de sepulturas e áreas
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Download"}>Exportar</IGRPButton>
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Share2"}>Compartilhar</IGRPButton>
              </div>
            </div>

            <QRCodeScanner />
          </div>
        )}

        {activeTab === "batch" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Geração em Lote</h2>
                <p className="text-muted-foreground">
                  Crie múltiplos QR Codes de uma vez
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Download"}>Baixar Todos</IGRPButton>
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Printer"}>Imprimir</IGRPButton>
              </div>
            </div>

            <QRCodeBatchGenerator />
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gerador de Relatórios</h2>
                <p className="text-muted-foreground">
                  Crie relatórios personalizados sobre cemitérios
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Filter"}>Filtros</IGRPButton>
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Search"}>Buscar</IGRPButton>
              </div>
            </div>

            <ReportGenerator />
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Templates de Relatórios</h2>
                <p className="text-muted-foreground">
                  Gerencie templates de relatórios personalizados
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Plus"}>Novo Template</IGRPButton>
                <IGRPButton variant="outline" size="sm" showIcon iconName={"Copy"}>Duplicar</IGRPButton>
              </div>
            </div>

            <ReportTemplates />
          </div>
        )}
      </div>
    </div>
  );
}
