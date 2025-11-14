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
  IGRPLabel,
} from "@igrp/igrp-framework-react-design-system";
import { useEffect, useState } from "react";
import type { QRCodeScanResult } from "@/types/QRCode";

interface QRCodeScannerProps {
  className?: string;
  onScan?: (result: QRCodeScanResult) => void;
}

export function QRCodeScanner({ className, onScan }: QRCodeScannerProps) {
  // Local state and handlers replacing the missing hook useQRCode
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<QRCodeScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<QRCodeScanResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    loadScanHistory();
  }, []);

  /**
   * Loads the last scans history.
   * Since no data source is available here, we keep local state only.
   */
  const loadScanHistory = async (): Promise<void> => {
    setScanHistory([]);
  };

  /**
   * Handles QR code scanning from camera or uploaded file.
   * Without a real scanning service, returns an explicit error.
   */
  const handleScanQRCode = async (imageFile?: File): Promise<void> => {
    try {
      setIsScanning(true);
      setLoading(true);
      setError(null);

      // Fallback: no real scanning service available in this context.
      throw new Error("Service unavailable - Try again later");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Error: ${err.message}`
          : "Error: Service unavailable - Try again later",
      );
    } finally {
      setIsScanning(false);
      setLoading(false);
    }
  };

  /**
   * Legacy camera scan simulation removed to enforce real-data only.
   * Use a proper scanning provider/service when available.
   */
  const simulateCameraScan = async (): Promise<QRCodeScanResult> => {
    throw new Error("Service unavailable - Try again later");
  };

  /**
   * Legacy manual scan simulation removed to enforce real-data only.
   * Use a proper scanning provider/service when available.
   */
  const simulateManualScan = async (): Promise<QRCodeScanResult> => {
    throw new Error("Service unavailable - Try again later");
  };

  /**
   * Validates the current scan by its id.
   * Placeholder implementation returning an error due to missing backend.
   */
  const handleValidateScan = async (scanId: string): Promise<void> => {
    if (!scanResult) return;
    setError("Error: Service unavailable - Try again later");
  };

  /**
   * Copies the current scan data to clipboard.
   */
  const handleCopyResult = (): void => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult.code);
    }
  };

  /**
   * Clears local scan history state.
   */
  const handleClearHistory = (): void => {
    setScanHistory([]);
  };

  /**
   * Triggers scanning with an uploaded image file.
   */
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      void handleScanQRCode(file);
    }
  };

  /**
   * Toggles camera active state.
   */
  const toggleCamera = (): void => {
    setCameraActive(!cameraActive);
  };

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="Camera" className="h-5 w-5 mr-2" />
              Scanner de QR Codes
            </IGRPCardTitle>
            <IGRPCardDescription>
              Escanee QR Codes de sepulturas e áreas do cemitério
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
              onClick={handleClearHistory}
              disabled={scanHistory.length === 0}
              showIcon
              iconName="RotateCcw"
            >
              Limpar
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

        {/* Área de scan */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {!cameraActive ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <IGRPIcon iconName="QrCode" className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-600 font-medium">Escanear QR Code</p>
                <p className="text-sm text-gray-500 mt-1">
                  Escolha uma opção abaixo para escanear o QR Code
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <IGRPButton
                  onClick={toggleCamera}
                  disabled={isScanning}
                  className="flex items-center gap-2"
                  showIcon
                  iconName="Camera"
                >
                  Câmera
                </IGRPButton>
                <IGRPButton
                  onClick={() => void handleScanQRCode()}
                  disabled={isScanning}
                  className="flex items-center gap-2"
                  showIcon
                  iconName="Zap"
                >
                  {isScanning ? "Escaneando..." : "Simular Scan"}
                </IGRPButton>
                <IGRPLabel className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isScanning}
                  />
                  <IGRPButton
                    disabled={isScanning}
                    className="flex items-center gap-2"
                    showIcon
                    iconName="Download"
                  >
                    Upload
                  </IGRPButton>
                </IGRPLabel>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center relative">
                <div className="w-24 h-24 border-2 border-green-500 rounded-lg animate-pulse">
                  <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-ping"></div>
                </div>
                <IGRPIcon
                  iconName="Camera"
                  className="h-8 w-8 text-green-500 absolute"
                />
              </div>
              <div>
                <p className="text-gray-600 font-medium">Câmera Ativa</p>
                <p className="text-sm text-gray-500 mt-1">
                  Posicione o QR Code dentro da área de scan
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <IGRPButton
                  onClick={() => void handleScanQRCode()}
                  disabled={isScanning}
                  className="flex items-center gap-2"
                  showIcon
                  iconName="Zap"
                >
                  {isScanning ? "Escaneando..." : "Escanear"}
                </IGRPButton>
                <IGRPButton
                  onClick={toggleCamera}
                  variant="outline"
                  className="flex items-center gap-2"
                  showIcon
                  iconName="EyeOff"
                >
                  Desativar
                </IGRPButton>
              </div>
            </div>
          )}
        </div>

        {/* Resultado do scan */}
        {scanResult && (
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IGRPIcon
                  iconName="CheckCircle"
                  className="h-5 w-5 text-green-600"
                />
                <h3 className="font-medium text-green-900">
                  QR Code Escaneado com Sucesso
                </h3>
              </div>
              <IGRPBadge
                variant="soft"
                color={scanResult.valid ? "success" : "warning"}
              >
                {scanResult.valid ? "Válido" : "Inválido"}
              </IGRPBadge>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <IGRPLabel className="text-sm text-gray-600">
                  Dados do QR Code:
                </IGRPLabel>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {scanResult.code}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <IGRPLabel className="text-gray-600">Cemitério:</IGRPLabel>
                  <p className="font-medium">{scanResult.cemeteryId}</p>
                </div>
                <div>
                  <IGRPLabel className="text-gray-600">Sepultura:</IGRPLabel>
                  <p className="font-medium">{scanResult.plotId}</p>
                </div>
                <div>
                  <IGRPLabel className="text-gray-600">Horário:</IGRPLabel>
                  <p className="font-medium">
                    {new Date(scanResult.scannedAt).toLocaleTimeString("pt-CV")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <IGRPButton
                  size="sm"
                  onClick={handleCopyResult}
                  className="flex items-center gap-2"
                  showIcon
                  iconName="Copy"
                >
                  Copiar Dados
                </IGRPButton>
                <IGRPButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleValidateScan(scanResult.code)}
                  disabled={loading}
                  className="flex items-center gap-2"
                  showIcon
                  iconName="CheckCircle"
                >
                  Validar
                </IGRPButton>
                <IGRPButton
                  size="sm"
                  variant="outline"
                  onClick={() => setScanResult(null)}
                  className="flex items-center gap-2"
                  showIcon
                  iconName="EyeOff"
                >
                  Ocultar
                </IGRPButton>
              </div>
            </div>
          </div>
        )}

        {/* Histórico de scans */}
        {showHistory && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Histórico de Scans</h3>
              <IGRPBadge variant="outline" color="info">
                {scanHistory.length} scans
              </IGRPBadge>
            </div>

            {scanHistory.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {scanHistory.map((scan, index) => (
                  <IGRPCard key={`${index}`} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IGRPIcon
                          iconName="QrCode"
                          className="h-4 w-4 text-gray-400"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {scan.cemeteryId} • {scan.plotId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(scan.scannedAt).toLocaleDateString(
                              "pt-CV",
                            )}{" "}
                            às{" "}
                            {new Date(scan.scannedAt).toLocaleTimeString(
                              "pt-CV",
                            )}
                          </p>
                        </div>
                      </div>
                      <IGRPBadge
                        variant="soft"
                        color={scan.valid ? "success" : "warning"}
                      >
                        {scan.valid ? "Válido" : "Inválido"}
                      </IGRPBadge>
                    </div>
                  </IGRPCard>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <IGRPIcon
                  iconName="QrCode"
                  className="h-8 w-8 mx-auto mb-2 text-gray-300"
                />
                <p className="text-sm">Nenhum scan realizado ainda</p>
                <p className="text-xs text-gray-400 mt-1">
                  Escaneie um QR Code para ver o histórico
                </p>
              </div>
            )}
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
