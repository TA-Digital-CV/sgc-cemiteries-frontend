"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { QRCodeBatchGenerator } from "@/components/qr-codes/QRCodeBatchGenerator";

/**
 * QRCodesBatchPage
 * Renders batch QR code generation UI aligned with FE-01 routes.
 */
export default function QRCodesBatchPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/qr-codes-reports">
            <IGRPButton
              variant="ghost"
              size="sm"
              showIcon
              iconName={"ArrowLeft"}
            >
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Geração em Lote
            </h1>
            <p className="text-muted-foreground">Crie QR Codes em escala</p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Configuração de Lote</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <QRCodeBatchGenerator />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
