"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
  IGRPInputText,
} from "@igrp/igrp-framework-react-design-system";
import React, { useEffect, useState } from "react";
import { useOperation } from "@/app/(myapp)/hooks/useOperation";
import type { Configuration } from "@/app/(myapp)/types/Operation";

interface ConfigurationPanelProps {
  scope: "SYSTEM" | "ORGANIZATION" | "CEMETERY" | "TEAM" | "USER";
  targetId?: string;
}

export function ConfigurationPanel({
  scope,
  targetId,
}: ConfigurationPanelProps) {
  const {
    configurations,
    isLoading,
    error,
    fetchConfigurations,
    updateConfiguration,
  } = useOperation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    fetchConfigurations(scope, targetId);
  }, [fetchConfigurations, scope, targetId]);

  const handleEdit = (config: Configuration) => {
    setEditingId(config.id);
    setEditValue(JSON.stringify(config.value));
  };

  const handleSave = async (id: string) => {
    try {
      let parsedValue = editValue;
      try {
        parsedValue = JSON.parse(editValue);
      } catch (e) {
        // If not JSON, keep as string
      }
      await updateConfiguration(id, parsedValue);
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
        role="alert"
      >
        <span className="font-medium">Erro!</span> {error.message}
      </div>
    );
  }

  return (
    <IGRPCard>
      <IGRPCardHeader>
        <IGRPCardTitle>Configurações ({scope})</IGRPCardTitle>
      </IGRPCardHeader>
      <IGRPCardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <IGRPIcon
              iconName="RefreshCw"
              className="h-6 w-6 animate-spin text-gray-400"
            />
            <span className="ml-2 text-gray-500">
              Carregando configurações...
            </span>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {configurations.map((config) => (
              <div key={config.id} className="p-4 border rounded bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{config.key}</h3>
                  <span className="text-xs text-gray-500">
                    {config.dataType}
                  </span>
                </div>

                {editingId === config.id ? (
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <IGRPInputText
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    </div>
                    <IGRPButton
                      size="sm"
                      variant="default"
                      onClick={() => handleSave(config.id)}
                    >
                      Salvar
                    </IGRPButton>
                    <IGRPButton
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </IGRPButton>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <pre className="bg-white p-2 rounded text-sm overflow-x-auto max-w-md border">
                      {JSON.stringify(config.value, null, 2)}
                    </pre>
                    <IGRPButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(config)}
                      iconName="Edit"
                      showIcon={true}
                    >
                      Editar
                    </IGRPButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
