import Link from "next/link";
import React from "react";
import { OperationList } from "@/components/operations/OperationList";

export default function OperationsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Operações</h1>
          <p className="text-gray-600">
            Acompanhe e gerencie as operações diárias
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/operations/configurations">
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Configurações
            </button>
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Nova Operação
          </button>
        </div>
      </div>

      <OperationList />
    </div>
  );
}
