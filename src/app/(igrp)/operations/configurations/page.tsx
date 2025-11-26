"use client";

import React, { useState } from "react";
import { ConfigurationPanel } from "@/components/operations/ConfigurationPanel";

export default function ConfigurationsPage() {
  const [activeTab, setActiveTab] = useState<
    "SYSTEM" | "ORGANIZATION" | "CEMETERY" | "TEAM" | "USER"
  >("SYSTEM");

  const tabs = [
    { id: "SYSTEM", label: "Sistema" },
    { id: "ORGANIZATION", label: "Organização" },
    { id: "CEMETERY", label: "Cemitério" },
    { id: "TEAM", label: "Equipe" },
    { id: "USER", label: "Usuário" },
  ] as const;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações Operacionais</h1>
        <p className="text-gray-600">
          Gerencie as configurações do sistema hierárquico
        </p>
      </div>

      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ConfigurationPanel scope={activeTab} />
    </div>
  );
}
