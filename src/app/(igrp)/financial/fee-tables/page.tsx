import Link from "next/link";
import React from "react";
import { FeeTableList } from "@/components/financial/FeeTableList";

export default function FeeTablesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tabelas de Taxas</h1>
          <p className="text-gray-600">Gerencie as taxas e emolumentos</p>
        </div>
        <div className="flex gap-2">
          <Link href="/financial">
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Voltar
            </button>
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Nova Taxa
          </button>
        </div>
      </div>

      <FeeTableList />
    </div>
  );
}
