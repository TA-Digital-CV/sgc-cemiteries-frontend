"use client";

import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPCheckbox,
  IGRPIcon,
  IGRPInputText,
  IGRPLabel,
  IGRPSelect,
} from "@igrp/igrp-framework-react-design-system";
import { useEffect, useState } from "react";
import type {
  Report,
  ReportFormat,
  ReportTemplate,
  ReportType,
} from "@/types/QRCode";

interface ReportTemplatesProps {
  className?: string;
  cemeteryId?: string;
}

/**
 * ReportTemplates renders the report templates management UI.
 * It provides search and type filtering, lists available templates,
 * and exposes actions to create, edit, delete and generate reports.
 * All UI elements use IGRP Design System components to ensure consistency.
 */
export function ReportTemplates({
  className,
  cemeteryId,
}: ReportTemplatesProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ReportType | "all">("all");

  const [templateForm, setTemplateForm] = useState<Partial<ReportTemplate>>({
    name: "",
    description: "",
    type: "OCCUPANCY" as ReportType,
    format: "PDF" as ReportFormat,
    sections: [],
  });

  useEffect(() => {
    loadTemplates();
  }, [cemeteryId]);

  /**
   * loadTemplates
   *
   * Attempts to load templates from the backend. Since the hook/data source
   * is unavailable, we provide a minimal fallback with a clear error message.
   */
  const loadTemplates = async (): Promise<void> => {
    setLoading(true);
    try {
      throw new Error("Service unavailable - Try again later");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Error: ${err.message}`
          : "Error: Service unavailable - Try again later",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = (): void => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: "",
      description: "",
      type: "OCCUPANCY",
      format: "PDF",
      sections: [],
    });
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm(template);
    setShowTemplateForm(true);
  };

  /**
   * handleSaveTemplate
   *
   * Saves or updates a template. Minimal fallback: returns an explicit error
   * because backend actions are unavailable.
   */
  const handleSaveTemplate = async (): Promise<void> => {
    if (!templateForm.name || !templateForm.type) return;

    try {
      throw new Error("Service unavailable - Try again later");
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Service unavailable - Try again later",
      );
    }
  };

  /**
   * handleDeleteTemplate
   *
   * Deletes a template. Minimal fallback: explicit error due to missing backend.
   */
  const handleDeleteTemplate = async (templateId: string): Promise<void> => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      try {
        throw new Error("Service unavailable - Try again later");
      } catch (error) {
        console.error("Erro ao excluir template:", error);
        setError(
          error instanceof Error
            ? `Error: ${error.message}`
            : "Error: Service unavailable - Try again later",
        );
      }
    }
  };

  /**
   * handleGenerateReportFromTemplate
   *
   * Generates a report from a template. Minimal fallback: explicit error.
   */
  const handleGenerateReportFromTemplate = async (
    template: ReportTemplate,
  ): Promise<void> => {
    try {
      throw new Error("Service unavailable - Try again later");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Service unavailable - Try again later",
      );
    }
  };

  /**
   * handleDownloadReport
   *
   * Downloads a report by id. Minimal fallback: explicit error.
   */
  const handleDownloadReport = async (reportId: string): Promise<void> => {
    try {
      throw new Error("Service unavailable - Try again later");
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Service unavailable - Try again later",
      );
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const reportTypeIcons: Record<ReportType, string> = {
    OCCUPANCY: "PieChart",
    CAPACITY: "BarChart3",
    FINANCIAL: "DollarSign",
    MAINTENANCE: "Settings",
    GROWTH_PROJECTION: "TrendingUp",
    COMPARATIVE: "PieChart",
    CUSTOM: "FileText",
  };

  const typeOptions: { label: string; value: ReportType | "all" }[] = [
    { label: "Todos", value: "all" },
    { label: "Ocupação", value: "OCCUPANCY" },
    { label: "Capacidade", value: "CAPACITY" },
    { label: "Financeiro", value: "FINANCIAL" },
    { label: "Manutenção", value: "MAINTENANCE" },
    { label: "Projeção de Crescimento", value: "GROWTH_PROJECTION" },
    { label: "Comparativo", value: "COMPARATIVE" },
    { label: "Personalizado", value: "CUSTOM" },
  ];

  const formatOptions: { label: string; value: ReportFormat }[] = [
    { label: "PDF", value: "PDF" },
    { label: "Excel", value: "EXCEL" },
    { label: "CSV", value: "CSV" },
    { label: "JSON", value: "JSON" },
    { label: "HTML", value: "HTML" },
  ];

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="FileText" className="h-5 w-5 mr-2" />
              Templates de Relatórios
            </IGRPCardTitle>
            <IGRPCardDescription>
              Gerencie templates de relatórios personalizados
            </IGRPCardDescription>
          </div>
          <div className="flex gap-2">
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              showIcon
              iconName="Eye"
            >
              Histórico
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={loadTemplates}
              disabled={loading}
              loading={loading}
              loadingText="Atualizando..."
              showIcon
              iconName="RefreshCw"
            >
              Atualizar
            </IGRPButton>
            <IGRPButton
              onClick={handleCreateTemplate}
              className="flex items-center gap-2"
              showIcon
              iconName="Plus"
            >
              Novo Template
            </IGRPButton>
          </div>
        </div>
      </IGRPCardHeader>

      <IGRPCardContent className="space-y-6">
        {/* Mensagem de erro */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <IGRPIcon iconName="AlertTriangle" className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Filtros e busca */}
        <div className="flex gap-4">
          <div className="flex-1">
            <IGRPInputText
              name="searchTemplates"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              showIcon
              iconName="Search"
            />
          </div>
          <div>
            <IGRPSelect
              options={typeOptions}
              value={filterType}
              onValueChange={(value) =>
                setFilterType(value as ReportType | "all")
              }
              placeholder="Todos os Tipos"
              selectClassName="border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Lista de templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const iconName = reportTypeIcons[template.type] || "FileText";
            return (
              <IGRPCard key={template.id} className="overflow-hidden">
                <IGRPCardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IGRPIcon
                          iconName={iconName}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                      <div>
                        <IGRPCardTitle className="text-sm">
                          {template.name}
                        </IGRPCardTitle>
                        <IGRPBadge variant="outline" color="info" size="sm">
                          {template.type}
                        </IGRPBadge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        className="h-6 w-6 p-0"
                        showIcon
                        iconName="Edit"
                      />
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="h-6 w-6 p-0 text-red-600"
                        showIcon
                        iconName="Trash2"
                      />
                    </div>
                  </div>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Formato:</span>
                      <span className="font-medium">{template.format}</span>
                    </div>
                  </div>

                  <IGRPButton
                    onClick={() => handleGenerateReportFromTemplate(template)}
                    disabled={loading}
                    className="w-full"
                    size="sm"
                    loading={loading}
                    loadingText="Gerando..."
                    showIcon
                    iconName="FileText"
                  >
                    Gerar Relatório
                  </IGRPButton>
                </IGRPCardContent>
              </IGRPCard>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            <IGRPIcon
              iconName="FileText"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="text-lg font-medium">Nenhum template encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filterType !== "all"
                ? "Tente ajustar seus filtros de busca"
                : "Crie seu primeiro template de relatório"}
            </p>
            {(searchTerm || filterType !== "all") && (
              <IGRPButton
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="mt-4"
              >
                Limpar Filtros
              </IGRPButton>
            )}
          </div>
        )}

        {/* Formulário de template */}
        {showTemplateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <IGRPCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <IGRPCardHeader>
                <IGRPCardTitle>
                  {selectedTemplate ? "Editar Template" : "Novo Template"}
                </IGRPCardTitle>
                <IGRPCardDescription>
                  Configure as opções do template de relatório
                </IGRPCardDescription>
              </IGRPCardHeader>
              <IGRPCardContent className="space-y-4">
                <div>
                  <IGRPLabel htmlFor="templateName">Nome do Template</IGRPLabel>
                  <IGRPInputText
                    name="templateName"
                    id="templateName"
                    value={templateForm.name || ""}
                    onChange={(e) =>
                      setTemplateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: Relatório Mensal de Ocupação"
                  />
                </div>

                <div>
                  <IGRPLabel htmlFor="templateDescription">Descrição</IGRPLabel>
                  <IGRPInputText
                    name="templateDescription"
                    id="templateDescription"
                    value={templateForm.description || ""}
                    onChange={(e) =>
                      setTemplateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Descrição detalhada do template"
                  />
                </div>

                <div>
                  <IGRPLabel htmlFor="templateType">
                    Tipo de Relatório
                  </IGRPLabel>
                  <IGRPSelect
                    options={typeOptions.filter((opt) => opt.value !== "all")}
                    value={templateForm.type || "OCCUPANCY"}
                    onValueChange={(value) =>
                      setTemplateForm((prev) => ({
                        ...prev,
                        type: value as ReportType,
                      }))
                    }
                    placeholder="Selecione o tipo"
                  />
                </div>

                <div>
                  <IGRPLabel htmlFor="templateFormat">Formato</IGRPLabel>
                  <IGRPSelect
                    options={formatOptions}
                    value={templateForm.format || "PDF"}
                    onValueChange={(value) =>
                      setTemplateForm((prev) => ({
                        ...prev,
                        format: value as ReportFormat,
                      }))
                    }
                    placeholder="Selecione o formato"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <IGRPButton onClick={handleSaveTemplate} className="flex-1">
                    Salvar Template
                  </IGRPButton>
                  <IGRPButton
                    variant="outline"
                    onClick={() => {
                      setShowTemplateForm(false);
                      setSelectedTemplate(null);
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </IGRPButton>
                </div>
              </IGRPCardContent>
            </IGRPCard>
          </div>
        )}

        {/* Histórico de relatórios */}
        {showHistory && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Histórico de Relatórios</h3>
              <IGRPBadge variant="outline" color="info" size="sm">
                {reports.length} relatórios
              </IGRPBadge>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reports.map((report) => (
                  <IGRPCard key={report.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IGRPIcon
                          iconName="FileText"
                          className="h-4 w-4 text-gray-400"
                        />
                        <div>
                          <p className="font-medium text-sm">{report.type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}{" "}
                            às{" "}
                            {new Date(report.createdAt).toLocaleTimeString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <IGRPBadge
                          variant="soft"
                          color={
                            report.status === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                          size="sm"
                        >
                          {report.status}
                        </IGRPBadge>
                        <IGRPButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                          disabled={report.status !== "COMPLETED"}
                          className="h-6 w-6 p-0"
                          showIcon
                          iconName="Download"
                        />
                      </div>
                    </div>
                  </IGRPCard>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <IGRPIcon
                  iconName="FileText"
                  className="h-8 w-8 mx-auto mb-2 text-gray-300"
                />
                <p className="text-sm">Nenhum relatório gerado ainda</p>
                <p className="text-xs text-gray-400 mt-1">
                  Gere um relatório para ver o histórico
                </p>
              </div>
            )}
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
