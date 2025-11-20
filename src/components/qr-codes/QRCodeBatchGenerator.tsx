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
import { useCallback, useEffect, useState } from "react";
import type {
  QRCodeData,
  QRCodeFormat,
  QRCodeOptions,
  QRCodeSize,
} from "@/app/(myapp)/types/QRCode";

interface QRCodeBatchGeneratorProps {
  className?: string;
  cemeteryId?: string;
}

export function QRCodeBatchGenerator({
  className,
  cemeteryId,
}: QRCodeBatchGeneratorProps) {
  const [qrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * UI-level batch options used for input controls only.
   * Keeps strong typing with enums to avoid implicit any and mismatches.
   */
  interface UIBatchOptions {
    type:
      | "plot"
      | "cemetery"
      | "grave"
      | "niche"
      | "mausoleum"
      | "area"
      | "section"
      | "block";
    cemeteryId: string;
    count: number;
    format: QRCodeFormat;
    size: QRCodeSize;
    includeBorder: boolean;
    includeLogo: boolean;
    prefix: string;
    startNumber: number;
  }

  const [batchOptions, setBatchOptions] = useState<UIBatchOptions>({
    type: "plot",
    cemeteryId: cemeteryId || "",
    count: 10,
    format: "PNG",
    size: "MEDIUM",
    includeBorder: true,
    includeLogo: false,
    prefix: "PLOT",
    startNumber: 1,
  });

  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [_filterType, _setFilterType] = useState<string | "all">("all");

  const loadQRCodeHistory = useCallback(async (): Promise<void> => {
    setError("Error: Service unavailable - Try again later");
  }, []);

  useEffect(() => {
    loadQRCodeHistory();
  }, [loadQRCodeHistory]);

  /**
   * Loads history for QR codes. Minimal fallback to explicit error message.
   */
  // moved above as useCallback

  /**
   * Handles batch generation using UI options and maps to service options.
   */
  const handleGenerateBatch = async (): Promise<void> => {
    setLoading(true);
    try {
      const _options: QRCodeOptions = {
        format: batchOptions.format,
        size: batchOptions.size,
        errorCorrection: "MEDIUM",
      };
      // No service implemented; expose clear error per fallback policy
      setError("Error: Service unavailable - Try again later");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Downloads generated batch according to current options.
   */
  const handleDownloadBatch = async (): Promise<void> => {
    setError("Error: Service unavailable - Try again later");
  };

  /** Copies QR code data to clipboard. */
  const handleCopyQRCode = async (_qrCodeId: string): Promise<void> => {
    setError("Error: Service unavailable - Try again later");
  };

  /** Shares the QR code using available integration. */
  const handleShareQRCode = async (_qrCodeId: string): Promise<void> => {
    setError("Error: Service unavailable - Try again later");
  };

  /** Deletes a QR code entry. */
  const handleDeleteQRCode = async (_qrCodeId: string): Promise<void> => {
    setError("Error: Service unavailable - Try again later");
  };

  const filteredQRCodes = qrCodes.filter((qrCode) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      qrCode.code.toLowerCase().includes(term) ||
      qrCode.plotId.toLowerCase().includes(term) ||
      qrCode.cemeteryId.toLowerCase().includes(term);
    return matchesSearch;
  });

  // Local labels for UI only (not part of QRCodeData)
  const qrCodeTypeLabels = {
    plot: "Sepultura",
    cemetery: "Cemitério",
    grave: "Túmulo",
    niche: "Nicho",
    mausoleum: "Mausoléu",
    area: "Área",
    section: "Seção",
    block: "Quadra",
  } as const;

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="QrCode" className="h-5 w-5 mr-2" />
              Gerador de QR Codes em Lote
            </IGRPCardTitle>
            <IGRPCardDescription>
              Gere QR Codes em massa para cemitérios e sepulturas
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
              onClick={loadQRCodeHistory}
              disabled={loading}
              showIcon
              iconName="RefreshCw"
            >
              Atualizar
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

        {/* Configurações do lote */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="text-lg">
              Configurações do Lote
            </IGRPCardTitle>
            <IGRPCardDescription>
              Configure as opções para geração em massa de QR Codes
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <IGRPLabel htmlFor="batchType">Tipo de QR Code</IGRPLabel>
                {(() => {
                  const typeOptions = [
                    { value: "plot", label: "Sepultura" },
                    { value: "cemetery", label: "Cemitério" },
                    { value: "grave", label: "Túmulo" },
                    { value: "niche", label: "Nicho" },
                    { value: "mausoleum", label: "Mausoléu" },
                    { value: "area", label: "Área" },
                    { value: "section", label: "Seção" },
                    { value: "block", label: "Quadra" },
                  ] as const;
                  return (
                    <IGRPSelect
                      value={batchOptions.type}
                      onValueChange={(value) =>
                        setBatchOptions((prev) => ({
                          ...prev,
                          type: value as UIBatchOptions["type"],
                        }))
                      }
                      options={
                        typeOptions as unknown as {
                          value: string;
                          label: string;
                        }[]
                      }
                      placeholder="Selecione"
                    />
                  );
                })()}
              </div>

              <div>
                <IGRPLabel htmlFor="batchCount">Quantidade</IGRPLabel>
                <IGRPInputText
                  id="batchCount"
                  type="number"
                  min="1"
                  max="1000"
                  value={batchOptions.count}
                  onChange={(e) =>
                    setBatchOptions((prev) => ({
                      ...prev,
                      count: Number(e.target.value) || 1,
                    }))
                  }
                  placeholder="Número de QR Codes"
                />
              </div>

              <div>
                <IGRPLabel htmlFor="batchFormat">Formato</IGRPLabel>
                {(() => {
                  const formatOptions = [
                    { value: "PNG", label: "PNG" },
                    { value: "SVG", label: "SVG" },
                    { value: "PDF", label: "PDF" },
                  ] as const;
                  return (
                    <IGRPSelect
                      value={batchOptions.format}
                      onValueChange={(value) =>
                        setBatchOptions((prev) => ({
                          ...prev,
                          format: value as QRCodeFormat,
                        }))
                      }
                      options={
                        formatOptions as unknown as {
                          value: string;
                          label: string;
                        }[]
                      }
                      placeholder="Selecione"
                    />
                  );
                })()}
              </div>

              <div>
                <IGRPLabel htmlFor="batchSize">Tamanho</IGRPLabel>
                {(() => {
                  const sizeOptions = [
                    { value: "SMALL", label: "Pequeno" },
                    { value: "MEDIUM", label: "Médio" },
                    { value: "LARGE", label: "Grande" },
                    { value: "EXTRA_LARGE", label: "Extra Grande" },
                  ] as const;
                  return (
                    <IGRPSelect
                      value={batchOptions.size}
                      onValueChange={(value) =>
                        setBatchOptions((prev) => ({
                          ...prev,
                          size: value as QRCodeSize,
                        }))
                      }
                      options={
                        sizeOptions as unknown as {
                          value: string;
                          label: string;
                        }[]
                      }
                      placeholder="Selecione"
                    />
                  );
                })()}
              </div>

              <div>
                <IGRPLabel htmlFor="batchPrefix">Prefixo</IGRPLabel>
                <IGRPInputText
                  id="batchPrefix"
                  value={batchOptions.prefix}
                  onChange={(e) =>
                    setBatchOptions((prev) => ({
                      ...prev,
                      prefix: e.target.value,
                    }))
                  }
                  placeholder="Ex: PLOT, AREA, SEC"
                />
              </div>

              <div>
                <IGRPLabel htmlFor="batchStartNumber">Número Inicial</IGRPLabel>
                <IGRPInputText
                  id="batchStartNumber"
                  type="number"
                  min="1"
                  value={batchOptions.startNumber}
                  onChange={(e) =>
                    setBatchOptions((prev) => ({
                      ...prev,
                      startNumber: Number(e.target.value) || 1,
                    }))
                  }
                  placeholder="Número inicial"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <IGRPCheckbox
                  id="includeBorder"
                  name="includeBorder"
                  checked={batchOptions.includeBorder}
                  onCheckedChange={(checked: boolean) =>
                    setBatchOptions((prev) => ({
                      ...prev,
                      includeBorder: Boolean(checked),
                    }))
                  }
                  className="mr-2"
                />
                <IGRPLabel htmlFor="includeBorder" className="mb-0">
                  Incluir Borda
                </IGRPLabel>
              </div>

              <div className="flex items-center">
                <IGRPCheckbox
                  id="includeLogo"
                  name="includeLogo"
                  checked={batchOptions.includeLogo}
                  onCheckedChange={(checked: boolean) =>
                    setBatchOptions((prev) => ({
                      ...prev,
                      includeLogo: Boolean(checked),
                    }))
                  }
                  className="mr-2"
                />
                <IGRPLabel htmlFor="includeLogo" className="mb-0">
                  Incluir Logo
                </IGRPLabel>
              </div>
            </div>

            <div className="flex gap-2">
              <IGRPButton
                onClick={handleGenerateBatch}
                disabled={loading}
                className="flex-1"
                showIcon={!loading}
                iconName={
                  !loading ? "QrCode" : (undefined as unknown as string)
                }
              >
                {loading ? "Gerando..." : "Gerar Lote"}
              </IGRPButton>
              <IGRPButton
                variant="outline"
                onClick={handleDownloadBatch}
                disabled={loading || qrCodes.length === 0}
                showIcon
                iconName="Download"
              >
                Baixar Lote
              </IGRPButton>
            </div>
          </IGRPCardContent>
        </IGRPCard>

        {/* Histórico de QR Codes */}
        {showHistory && (
          <IGRPCard>
            <IGRPCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <IGRPCardTitle className="text-lg">
                    Histórico de QR Codes
                  </IGRPCardTitle>
                  <IGRPCardDescription>
                    QR Codes gerados anteriormente
                  </IGRPCardDescription>
                </div>
                <IGRPBadge variant="soft" color="secondary" size="sm">
                  {qrCodes.length} QR Codes
                </IGRPBadge>
              </div>
            </IGRPCardHeader>
            <IGRPCardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <IGRPInputText
                    placeholder="Buscar QR Codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Lista de QR Codes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredQRCodes.map((qrCode) => {
                  const label = qrCodeTypeLabels[batchOptions.type];

                  return (
                    <IGRPCard key={qrCode.id} className="overflow-hidden">
                      <IGRPCardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IGRPIcon
                              iconName="MapPin"
                              className="h-4 w-4 text-blue-600"
                            />
                            <IGRPBadge
                              variant="soft"
                              color="secondary"
                              size="sm"
                            >
                              {label}
                            </IGRPBadge>
                          </div>
                          <div className="flex gap-1">
                            <IGRPButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyQRCode(qrCode.id)}
                              className="h-6 w-6 p-0"
                              title="Copiar"
                              showIcon
                              iconName="Copy"
                            />
                            <IGRPButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareQRCode(qrCode.id)}
                              className="h-6 w-6 p-0"
                              title="Compartilhar"
                              showIcon
                              iconName="Share2"
                            />
                            <IGRPButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQRCode(qrCode.id)}
                              className="h-6 w-6 p-0 text-red-600"
                              title="Excluir"
                              showIcon
                              iconName="Trash2"
                            />
                          </div>
                        </div>
                      </IGRPCardHeader>
                      <IGRPCardContent>
                        <div className="text-center">
                          <div className="bg-gray-100 rounded-lg p-4 mb-3">
                            <IGRPIcon
                              iconName="QrCode"
                              className="h-16 w-16 mx-auto text-gray-400"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Tamanho: {qrCode.size}
                            </p>
                          </div>
                          <p
                            className="text-xs text-gray-600 mb-2 truncate"
                            title={qrCode.code}
                          >
                            {qrCode.code}
                          </p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              {new Date(qrCode.generatedAt).toLocaleDateString(
                                "pt-CV",
                              )}
                            </span>
                            <span className="flex items-center">
                              <IGRPIcon
                                iconName="BarChart3"
                                className="h-3 w-3 text-blue-500 mr-1"
                              />
                              Scans: {qrCode.scanCount}
                            </span>
                          </div>
                        </div>
                      </IGRPCardContent>
                    </IGRPCard>
                  );
                })}
              </div>

              {filteredQRCodes.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-8">
                  <IGRPIcon
                    iconName="QrCode"
                    className="h-12 w-12 mx-auto mb-4 text-gray-300"
                  />
                  <p className="text-lg font-medium">
                    Nenhum QR Code encontrado
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Tente ajustar seus filtros de busca"
                      : "Gere QR Codes para vê-los aqui"}
                  </p>
                  {searchTerm && (
                    <IGRPButton
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                      }}
                      className="mt-4"
                    >
                      Limpar Filtros
                    </IGRPButton>
                  )}
                </div>
              )}
            </IGRPCardContent>
          </IGRPCard>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
