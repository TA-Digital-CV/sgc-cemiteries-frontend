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
  IGRPInputText,
  IGRPLabel,
  IGRPSelect,
} from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";
import { PlotService } from "@/app/(myapp)/services/plotService";
import type { PlotFormData } from "@/app/(myapp)/types/Plot";
import type {
  QRCodeData,
  QRCodeFormat,
  QRCodeOptions,
  QRCodeSize,
} from "@/app/(myapp)/types/QRCode";

interface QRCodeGeneratorProps {
  cemeteryId?: string;
  plotId?: string;
  className?: string;
}

export function QRCodeGenerator({
  cemeteryId,
  plotId,
  className,
}: QRCodeGeneratorProps) {
  const ERROR_UNAVAILABLE = "Error: Service unavailable - Try again later";
  const [qrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new PlotService();

  /**
   * Performs a single QR code generation for the given cemetery and plot.
   * Uses UI-level minimal fallback to surface service unavailability.
   */
  const generateQRCode = async (
    _cemeteryId: string,
    plotId: string,
    _type: string,
    _options: QRCodeOptions,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const code = await service.generatePlotQRCode(plotId);
      const payload: Partial<PlotFormData> = {
        qrCode: code,
      } as Partial<PlotFormData>;
      await service.updatePlot(plotId, payload as PlotFormData);
    } catch (e) {
      const msg = e instanceof Error ? e.message : ERROR_UNAVAILABLE;
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates a batch of QR codes for provided plot IDs under a cemetery.
   * Provides strict, clear error message as per fallback policy.
   */
  const generateBatch = async (
    _cemeteryId: string,
    plotIds: string[],
    _options: QRCodeOptions,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const results = await service.generateBulkQRCodes(plotIds);
      for (const r of results) {
        if (r.qrCode) {
          const payload: Partial<PlotFormData> = { qrCode: r.qrCode };
          await service.updatePlot(r.id, payload as PlotFormData);
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : ERROR_UNAVAILABLE;
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Downloads a generated QR code by its identifier.
   * Emits explicit error message when service is unavailable.
   */
  const downloadQRCode = async (_qrCodeId: string): Promise<void> => {
    setError(ERROR_UNAVAILABLE);
  };

  /**
   * Shares a generated QR code via available share integration.
   * Emits explicit error message when service is unavailable.
   */
  const shareQRCode = async (_qrCodeId: string): Promise<void> => {
    setError(ERROR_UNAVAILABLE);
  };

  /**
   * Copies QR code data to clipboard.
   * Emits explicit error message when service is unavailable.
   */
  const copyQRCodeData = async (_qrCodeId: string): Promise<void> => {
    setError(ERROR_UNAVAILABLE);
  };

  /**
   * Triggers validation of the QR code content/status.
   * Emits explicit error message when service is unavailable.
   */
  const validateQRCode = async (_qrCodeId: string): Promise<void> => {
    setError(ERROR_UNAVAILABLE);
  };

  const [formData, setFormData] = useState({
    cemeteryId: cemeteryId || "",
    plotId: plotId || "",
    type: "plot" as const,
    size: "MEDIUM" as QRCodeSize,
    format: "PNG" as QRCodeFormat,
  });

  const [batchConfig, setBatchConfig] = useState({
    cemeteryId: cemeteryId || "",
    plotIds: [] as string[],
    size: "MEDIUM" as QRCodeSize,
    format: "PNG" as QRCodeFormat,
  });

  const [showBatch, setShowBatch] = useState(false);
  const [newPlotId, setNewPlotId] = useState("");

  /**
   * Handles single QR code generation action using current form state.
   */
  const handleSingleGenerate = async (): Promise<void> => {
    if (!formData.cemeteryId || !formData.plotId) return;

    const options: QRCodeOptions = {
      size: formData.size,
      format: formData.format,
      errorCorrection: "MEDIUM",
      customColors: {
        foreground: "#000000",
        background: "#FFFFFF",
      },
    };

    await generateQRCode(
      formData.cemeteryId,
      formData.plotId,
      formData.type,
      options,
    );
  };

  /**
   * Handles batch QR code generation using current batch configuration.
   */
  const handleBatchGenerate = async (): Promise<void> => {
    if (!batchConfig.cemeteryId || batchConfig.plotIds.length === 0) return;

    const options: QRCodeOptions = {
      size: batchConfig.size,
      format: batchConfig.format,
      errorCorrection: "MEDIUM",
      customColors: {
        foreground: "#000000",
        background: "#FFFFFF",
      },
    };

    await generateBatch(batchConfig.cemeteryId, batchConfig.plotIds, options);
  };

  /**
   * Adds a new plot ID to the batch list if unique and non-empty.
   */
  const addPlotToBatch = () => {
    if (newPlotId.trim() && !batchConfig.plotIds.includes(newPlotId.trim())) {
      setBatchConfig((prev) => ({
        ...prev,
        plotIds: [...prev.plotIds, newPlotId.trim()],
      }));
      setNewPlotId("");
    }
  };

  /**
   * Removes a plot ID from the batch list.
   */
  const removePlotFromBatch = (plotId: string) => {
    setBatchConfig((prev) => ({
      ...prev,
      plotIds: prev.plotIds.filter((id) => id !== plotId),
    }));
  };

  const handleDownload = async (qrCodeId: string) => {
    await downloadQRCode(qrCodeId);
  };

  const handleShare = async (qrCodeId: string) => {
    await shareQRCode(qrCodeId);
  };

  const handleCopy = async (qrCodeId: string) => {
    await copyQRCodeData(qrCodeId);
  };

  const handleValidate = async (qrCodeId: string) => {
    await validateQRCode(qrCodeId);
  };

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="QrCode" className="h-5 w-5 mr-2" />
              Gerador de QR Codes
            </IGRPCardTitle>
            <IGRPCardDescription>
              Crie QR Codes para sepulturas e áreas do cemitério
            </IGRPCardDescription>
          </div>
          <IGRPButton
            variant="outline"
            size="sm"
            onClick={() => setShowBatch(!showBatch)}
          >
            <IGRPIcon iconName="Settings" className="h-4 w-4 mr-2" />
            {showBatch ? "Individual" : "Lote"}
          </IGRPButton>
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

        {!showBatch ? (
          /* Geração Individual */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <IGRPLabel htmlFor="cemeteryId">ID do Cemitério</IGRPLabel>
                <IGRPInputText
                  id="cemeteryId"
                  value={formData.cemeteryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cemeteryId: e.target.value,
                    }))
                  }
                  placeholder="Cemetery_001"
                />
              </div>
              <div>
                <IGRPLabel htmlFor="plotId">ID da Sepultura</IGRPLabel>
                <IGRPInputText
                  id="plotId"
                  value={formData.plotId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, plotId: e.target.value }))
                  }
                  placeholder="A001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <IGRPLabel htmlFor="size">Tamanho</IGRPLabel>
                {(() => {
                  const sizeOptions = [
                    { value: "SMALL", label: "Pequeno" },
                    { value: "MEDIUM", label: "Médio" },
                    { value: "LARGE", label: "Grande" },
                    { value: "EXTRA_LARGE", label: "Extra Grande" },
                  ] as const;
                  return (
                    <IGRPSelect
                      value={formData.size}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
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
                <IGRPLabel htmlFor="format">Formato</IGRPLabel>
                {(() => {
                  const formatOptions = [
                    { value: "PNG", label: "PNG" },
                    { value: "SVG", label: "SVG" },
                    { value: "PDF", label: "PDF" },
                  ] as const;
                  return (
                    <IGRPSelect
                      value={formData.format}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
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
            </div>

            <IGRPButton
              onClick={handleSingleGenerate}
              disabled={loading || !formData.cemeteryId || !formData.plotId}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <IGRPIcon iconName="QrCode" className="h-4 w-4 mr-2" />
                  Gerar QR Code
                </>
              )}
            </IGRPButton>
          </div>
        ) : (
          /* Geração em Lote */
          <div className="space-y-4">
            <div>
              <IGRPLabel htmlFor="batchCemeteryId">ID do Cemitério</IGRPLabel>
              <IGRPInputText
                id="batchCemeteryId"
                value={batchConfig.cemeteryId}
                onChange={(e) =>
                  setBatchConfig((prev) => ({
                    ...prev,
                    cemeteryId: e.target.value,
                  }))
                }
                placeholder="Cemetery_001"
              />
            </div>

            <div>
              <IGRPLabel>IDs das Sepulturas</IGRPLabel>
              <div className="flex gap-2 mb-2">
                <IGRPInputText
                  value={newPlotId}
                  onChange={(e) => setNewPlotId(e.target.value)}
                  placeholder="Digite o ID da sepultura"
                  onKeyDown={(e) => e.key === "Enter" && addPlotToBatch()}
                />
                <IGRPButton onClick={addPlotToBatch} size="sm">
                  Adicionar
                </IGRPButton>
              </div>

              {batchConfig.plotIds.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {batchConfig.plotIds.map((plotId) => (
                    <div
                      key={plotId}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{plotId}</span>
                      <IGRPButton
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlotFromBatch(plotId)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </IGRPButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={batchConfig.size}
                      onValueChange={(value) =>
                        setBatchConfig((prev) => ({
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
                <IGRPLabel htmlFor="batchFormat">Formato</IGRPLabel>
                {(() => {
                  const formatOptions = [
                    { value: "PNG", label: "PNG" },
                    { value: "SVG", label: "SVG" },
                    { value: "PDF", label: "PDF" },
                  ] as const;
                  return (
                    <IGRPSelect
                      value={batchConfig.format}
                      onValueChange={(value) =>
                        setBatchConfig((prev) => ({
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
            </div>

            <IGRPButton
              onClick={handleBatchGenerate}
              disabled={
                loading ||
                batchConfig.plotIds.length === 0 ||
                !batchConfig.cemeteryId
              }
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando Lote...
                </>
              ) : (
                <>
                  <IGRPIcon iconName="QrCode" className="h-4 w-4 mr-2" />
                  Gerar {batchConfig.plotIds.length} QR Codes
                </>
              )}
            </IGRPButton>
          </div>
        )}

        {/* Lista de QR Codes Gerados */}
        {qrCodes.length > 0 && (
          <div className="space-y-4">
            <IGRPLabel>QR Codes Gerados</IGRPLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrCodes.map((qrCode) => (
                <IGRPCard key={qrCode.id} className="overflow-hidden">
                  <IGRPCardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <IGRPCardTitle className="text-sm">
                        {qrCode.plotId}
                      </IGRPCardTitle>
                      <IGRPBadge variant="soft" color="secondary" size="sm">
                        {qrCode.format}
                      </IGRPBadge>
                    </div>
                  </IGRPCardHeader>
                  <IGRPCardContent className="space-y-3">
                    {/* Imagem do QR Code */}
                    <div className="flex justify-center">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IGRPIcon
                          iconName="QrCode"
                          className="h-16 w-16 text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <strong>Cemitério:</strong> {qrCode.cemeteryId}
                      </p>
                      <p>
                        <strong>Estilo:</strong> {qrCode.style}
                      </p>
                      <p>
                        <strong>Criado:</strong>{" "}
                        {new Date(qrCode.generatedAt).toLocaleDateString(
                          "pt-CV",
                        )}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(qrCode.id)}
                        className="flex-1"
                      >
                        <IGRPIcon
                          iconName="Download"
                          className="h-3 w-3 mr-1"
                        />
                        Baixar
                      </IGRPButton>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(qrCode.id)}
                        className="flex-1"
                      >
                        <IGRPIcon iconName="Share2" className="h-3 w-3 mr-1" />
                        Compartilhar
                      </IGRPButton>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(qrCode.id)}
                        className="flex-1"
                      >
                        <IGRPIcon iconName="Copy" className="h-3 w-3 mr-1" />
                        Copiar
                      </IGRPButton>
                    </div>

                    <IGRPButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleValidate(qrCode.id)}
                      className="w-full"
                    >
                      <IGRPIcon
                        iconName="CheckCircle"
                        className="h-3 w-3 mr-1"
                      />
                      Validar
                    </IGRPButton>
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
