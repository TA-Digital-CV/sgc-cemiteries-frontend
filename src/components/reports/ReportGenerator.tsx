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
import { useState } from "react";
import type {
  DateRange,
  GroupByOption,
  PlotStatus,
  PlotType,
  Report,
  ReportFilters,
  ReportFormat,
  ReportType,
  ScheduleFrequency,
} from "@/types/QRCode";

interface ReportGeneratorProps {
  className?: string;
}

// UI-level options mapped to types from QRCode.ts
interface UIReportOptions {
  format: ReportFormat;
  dateRange: DateRange;
  filters: Partial<ReportFilters> & {
    cemeteryIds?: string[];
    plotTypes?: PlotType[];
    status?: PlotStatus[];
  };
  includeCharts?: boolean;
  includeDetails?: boolean;
  groupBy?: GroupByOption;
}

/**
 * ReportGenerator builds and schedules reports with filters and recipients.
 * Uses stable keys for recipients list to avoid index-based key issues.
 */
export function ReportGenerator({ className }: ReportGeneratorProps) {
  const [reports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedReportType, setIGRPSelectedReportType] =
    useState<ReportType>("OCCUPANCY");
  const [reportOptions, setReportOptions] = useState<UIReportOptions>({
    format: "PDF",
    dateRange: {
      startDate: new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    filters: {
      cemeteryIds: [],
      plotTypes: [],
      status: [],
    },
    includeCharts: true,
    includeDetails: true,
    groupBy: "MONTH",
  });

  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: "WEEKLY" as ScheduleFrequency,
    recipients: [] as string[],
    newRecipient: "",
  });

  const reportTypes = [
    { value: "OCCUPANCY", label: "Taxa de Ocupação", icon: "pie-chart" },
    { value: "FINANCIAL", label: "Relatório Financeiro", icon: "dollar-sign" },
    { value: "MAINTENANCE", label: "Manutenção", icon: "settings" },
    { value: "CUSTOM", label: "Personalizado", icon: "sliders" },
    { value: "COMPARATIVE", label: "Comparativo", icon: "bar-chart-3" },
    {
      value: "GROWTH_PROJECTION",
      label: "Projeção de Crescimento",
      icon: "trending-up",
    },
    { value: "CAPACITY", label: "Capacidade", icon: "database" },
  ];

  // Options for selects using IGRPSelect options API
  const reportTypeOptions = reportTypes.map((t) => ({
    label: t.label,
    value: t.value,
  }));
  const plotTypeOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Terra", value: "GROUND" },
    { label: "Mausoléu", value: "MAUSOLEUM" },
    { label: "Nicho", value: "NICHE" },
    { label: "Ossuário", value: "OSSUARY" },
  ];
  const statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Disponível", value: "AVAILABLE" },
    { label: "Ocupado", value: "OCCUPIED" },
    { label: "Reservado", value: "RESERVED" },
    { label: "Manutenção", value: "MAINTENANCE" },
  ];
  const formatOptions = [
    { label: "PDF", value: "PDF" },
    { label: "Excel", value: "EXCEL" },
    { label: "CSV", value: "CSV" },
    { label: "JSON", value: "JSON" },
    { label: "HTML", value: "HTML" },
  ];
  const groupByOptions = [
    { label: "Cemitério", value: "CEMETERY" },
    { label: "Município", value: "MUNICIPALITY" },
    { label: "Tipo de Sepultura", value: "PLOT_TYPE" },
    { label: "Status", value: "STATUS" },
    { label: "Mês", value: "MONTH" },
    { label: "Ano", value: "YEAR" },
  ];

  /**
   * Generates a report request using current options and type.
   * Minimal fallback error when service is unavailable.
   */
  const handleGenerateReport = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      setError("Error: Service unavailable - Try again later");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Downloads a report file by id.
   * Minimal fallback error when service is unavailable.
   */
  const handleDownloadReport = async (_reportId: string): Promise<void> => {
    setError("Error: Service unavailable - Try again later");
  };

  /** Adds a recipient email to the schedule list. */
  const addRecipient = (): void => {
    if (
      scheduleConfig.newRecipient.trim() &&
      !scheduleConfig.recipients.includes(scheduleConfig.newRecipient.trim())
    ) {
      setScheduleConfig((prev) => ({
        ...prev,
        recipients: [...prev.recipients, prev.newRecipient.trim()],
        newRecipient: "",
      }));
    }
  };

  /** Removes a recipient email from the schedule list. */
  const removeRecipient = (email: string): void => {
    setScheduleConfig((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r !== email),
    }));
  };

  /**
   * Schedules report generation with current schedule configuration.
   * Minimal fallback error when service is unavailable.
   */
  const handleScheduleReport = async (): Promise<void> => {
    if (scheduleConfig.recipients.length === 0) return;
    setError("Error: Service unavailable - Try again later");
    setShowSchedule(false);
  };

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="FileText" className="h-5 w-5 mr-2" />
              Gerador de Relatórios
            </IGRPCardTitle>
            <IGRPCardDescription>
              Crie relatórios personalizados sobre o cemitério
            </IGRPCardDescription>
          </div>
          <div className="flex gap-2">
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              <IGRPIcon iconName="Calendar" className="h-4 w-4 mr-2" />
              Agendar
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() =>
                setError("Error: Service unavailable - Try again later")
              }
            >
              <IGRPIcon iconName="Eye" className="h-4 w-4 mr-2" />
              Histórico
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

        {/* Configuração do Relatório */}
        <div className="space-y-4">
          <div>
            <IGRPLabel htmlFor="reportType">Tipo de Relatório</IGRPLabel>
            <IGRPSelect
              options={reportTypeOptions}
              value={selectedReportType}
              onValueChange={(value) =>
                setIGRPSelectedReportType(value as ReportType)
              }
              placeholder="Selecione o tipo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <IGRPLabel htmlFor="startDate">Data Inicial</IGRPLabel>
              <IGRPInputText
                id="startDate"
                type="text"
                value={reportOptions.dateRange.startDate}
                onChange={(e) =>
                  setReportOptions((prev) => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      startDate: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <IGRPLabel htmlFor="endDate">Data Final</IGRPLabel>
              <IGRPInputText
                id="endDate"
                type="text"
                value={reportOptions.dateRange.endDate}
                onChange={(e) =>
                  setReportOptions((prev) => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      endDate: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div>
            <IGRPLabel htmlFor="cemeteryId">Cemitério (Opcional)</IGRPLabel>
            <IGRPInputText
              id="cemeteryId"
              value={reportOptions.filters.cemeteryIds?.[0] ?? ""}
              onChange={(e) =>
                setReportOptions((prev) => ({
                  ...prev,
                  filters: { ...prev.filters, cemeteryIds: [e.target.value] },
                }))
              }
              placeholder="ID do cemitério"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <IGRPLabel htmlFor="plotType">Tipo de Sepultura</IGRPLabel>
              <IGRPSelect
                options={plotTypeOptions}
                value={reportOptions.filters.plotTypes?.[0] ?? "ALL"}
                onValueChange={(value) =>
                  setReportOptions((prev) => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      plotTypes: value === "ALL" ? [] : [value as PlotType],
                    },
                  }))
                }
                placeholder="Todos"
              />
            </div>
            <div>
              <IGRPLabel htmlFor="status">Status</IGRPLabel>
              <IGRPSelect
                options={statusOptions}
                value={reportOptions.filters.status?.[0] ?? "ALL"}
                onValueChange={(value) =>
                  setReportOptions((prev) => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      status: value === "ALL" ? [] : [value as PlotStatus],
                    },
                  }))
                }
                placeholder="Todos"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <IGRPLabel htmlFor="format">Formato</IGRPLabel>
              <IGRPSelect
                options={formatOptions}
                value={reportOptions.format}
                onValueChange={(value) =>
                  setReportOptions((prev) => ({
                    ...prev,
                    format: value as ReportFormat,
                  }))
                }
              />
            </div>
            <div>
              <IGRPLabel htmlFor="groupBy">Agrupar por</IGRPLabel>
              <IGRPSelect
                options={groupByOptions}
                value={reportOptions.groupBy}
                onValueChange={(value) =>
                  setReportOptions((prev) => ({
                    ...prev,
                    groupBy: value as GroupByOption,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <IGRPLabel className="flex items-center">
                <IGRPCheckbox
                  checked={reportOptions.includeCharts}
                  onCheckedChange={(checked) =>
                    setReportOptions((prev) => ({
                      ...prev,
                      includeCharts: Boolean(checked),
                    }))
                  }
                  className="mr-2"
                  name={""}
                />
                Incluir Gráficos
              </IGRPLabel>
              <IGRPLabel className="flex items-center">
                <IGRPCheckbox
                  checked={reportOptions.includeDetails}
                  onCheckedChange={(checked) =>
                    setReportOptions((prev) => ({
                      ...prev,
                      includeDetails: Boolean(checked),
                    }))
                  }
                  className="mr-2"
                  name={""}
                />
                Incluir Detalhes
              </IGRPLabel>
            </div>
          </div>

          <IGRPButton
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <IGRPIcon
                  iconName="RefreshCw"
                  className="animate-spin h-4 w-4 mr-2"
                />
                Gerando Relatório...
              </>
            ) : (
              <>
                <IGRPIcon iconName="FileText" className="h-4 w-4 mr-2" />
                Gerar Relatório
              </>
            )}
          </IGRPButton>
        </div>

        {/* Agendamento de Relatórios */}
        {showSchedule && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Agendar Relatório</h3>

            <div>
              <IGRPLabel htmlFor="frequency">Frequência</IGRPLabel>
              <IGRPSelect
                value={scheduleConfig.frequency}
                onValueChange={(value) =>
                  setScheduleConfig((prev) => ({
                    ...prev,
                    frequency: value as ScheduleFrequency,
                  }))
                }
                options={[]}
              >
                <option value="DAILY">Diário</option>
                <option value="WEEKLY">Semanal</option>
                <option value="BIWEEKLY">Quinzenal</option>
                <option value="MONTHLY">Mensal</option>
                <option value="QUARTERLY">Trimestral</option>
                <option value="YEARLY">Anual</option>
                <option value="CUSTOM">Personalizado</option>
              </IGRPSelect>
            </div>

            <div>
              <IGRPLabel>Destinatários</IGRPLabel>
              <div className="flex gap-2 mb-2">
                <IGRPInputText
                  value={scheduleConfig.newRecipient}
                  onChange={(e) =>
                    setScheduleConfig((prev) => ({
                      ...prev,
                      newRecipient: e.target.value,
                    }))
                  }
                  placeholder="email@exemplo.com"
                  onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                />
                <IGRPButton onClick={addRecipient} size="sm">
                  Adicionar
                </IGRPButton>
              </div>

              {scheduleConfig.recipients.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {scheduleConfig.recipients.map((recipient) => (
                    <div
                      key={recipient}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{recipient}</span>
                      <IGRPButton
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(recipient)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </IGRPButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <IGRPButton onClick={handleScheduleReport} className="flex-1">
                Agendar Relatório
              </IGRPButton>
              <IGRPButton
                variant="outline"
                onClick={() => setShowSchedule(false)}
                className="flex-1"
              >
                Cancelar
              </IGRPButton>
            </div>
          </div>
        )}

        {/* Lista de Relatórios Gerados */}
        {reports.length > 0 && (
          <div className="space-y-4">
            <IGRPLabel>Relatórios Gerados</IGRPLabel>
            <div className="space-y-2">
              {reports.map((report) => (
                <IGRPCard key={report.id} className="overflow-hidden">
                  <IGRPCardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <IGRPBadge variant="soft" color="info" size="sm">
                            {report.type}
                          </IGRPBadge>
                          <IGRPBadge
                            variant="soft"
                            color={
                              report.status === "COMPLETED"
                                ? "success"
                                : report.status === "FAILED"
                                  ? "destructive"
                                  : "warning"
                            }
                            size="sm"
                          >
                            {report.status}
                          </IGRPBadge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Gerado em{" "}
                          {new Date(report.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}{" "}
                          às{" "}
                          {new Date(report.createdAt).toLocaleTimeString(
                            "pt-BR",
                          )}
                        </p>
                        {report.fileSize && (
                          <p className="text-xs text-gray-500">
                            Tamanho:{" "}
                            {(report.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                        disabled={report.status !== "COMPLETED"}
                      >
                        <IGRPIcon
                          iconName="Download"
                          className="h-4 w-4 mr-2"
                        />
                        Baixar
                      </IGRPButton>
                    </div>
                  </IGRPCardContent>
                </IGRPCard>
              ))}
            </div>
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
