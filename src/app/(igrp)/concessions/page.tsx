import Link from "next/link";
import React from "react";
import { ConcessionList } from "@/components/concessions/ConcessionList";
// import { IGRPPageHeader, IGRPButton } from "@igrp/igrp-framework-react-design-system";

export default function ConcessionsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Concessões</h1>
          <p className="text-gray-600">Gerencie as concessões do sistema</p>
        </div>
        <Link href="/concessions/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Nova Concessão
          </button>
        </Link>
      </div>

      <ConcessionList />
    </div>
  );
}
