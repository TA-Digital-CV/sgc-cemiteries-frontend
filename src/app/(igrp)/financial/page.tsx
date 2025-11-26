import Link from "next/link";
import React from "react";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";

export default function FinancialPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão Financeira</h1>
          <p className="text-gray-600">Visão geral das finanças do sistema</p>
        </div>
        <div className="flex gap-2">
          <Link href="/financial/fee-tables">
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Tabelas de Taxas
            </button>
          </Link>
          <Link href="/financial/payments">
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Pagamentos
            </button>
          </Link>
        </div>
      </div>

      <FinancialDashboard />

      {/* We could add recent transactions or charts here */}
    </div>
  );
}
