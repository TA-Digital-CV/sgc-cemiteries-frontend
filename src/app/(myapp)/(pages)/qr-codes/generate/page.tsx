"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { QRCodeGenerator } from "@/components/qr-codes/QRCodeGenerator";

/**
 * QRCodesGeneratePage
 * Renders single QR code generation UI aligned with FE-01 routes.
 */
export default function QRCodesGeneratePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/qr-codes-reports">
            <IGRPButton variant="ghost" size="sm" showIcon iconName={"ArrowLeft"}>
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerar QR Code</h1>
            <p className="text-muted-foreground">
              Crie QR Codes para sepulturas
            </p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Geração Individual</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <QRCodeGenerator />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
