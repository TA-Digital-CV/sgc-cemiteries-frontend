"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPInputText,
} from "@igrp/igrp-framework-react-design-system";
import type React from "react";
import { useState } from "react";
import { useConcession } from "@/app/(myapp)/hooks/useConcession";
import type { ConcessionFormData } from "@/app/(myapp)/types/Concession";

interface ConcessionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ConcessionForm({ onSuccess, onCancel }: ConcessionFormProps) {
  const { createConcession, isLoading, error } = useConcession();

  const [formData, setFormData] = useState<ConcessionFormData>({
    typeId: "",
    holder: {
      name: "",
      document: "",
      email: "",
      phone: "",
      type: "INDIVIDUAL",
      address: {
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    location: {
      cemeteryId: "",
      sectorId: "",
      blockId: "",
      lotId: "",
    },
    documents: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConcession(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const updateHolder = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      holder: { ...prev.holder, [field]: value },
    }));
  };

  const updateAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      holder: {
        ...prev.holder,
        address: { ...prev.holder.address, [field]: value },
      },
    }));
  };

  return (
    <IGRPCard>
      <IGRPCardHeader>
        <IGRPCardTitle>Nova Concessão</IGRPCardTitle>
      </IGRPCardHeader>
      <IGRPCardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-medium">Erro!</span> {error.message}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold border-b pb-2">Dados do Titular</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IGRPInputText
                label="Nome"
                required
                value={formData.holder.name}
                onChange={(e) => updateHolder("name", e.target.value)}
              />

              <IGRPInputText
                label="CPF/CNPJ"
                required
                value={formData.holder.document}
                onChange={(e) => updateHolder("document", e.target.value)}
              />

              <IGRPInputText
                label="Email"
                type="email"
                required
                value={formData.holder.email}
                onChange={(e) => updateHolder("email", e.target.value)}
              />

              <IGRPInputText
                label="Telefone"
                type="text"
                required
                value={formData.holder.phone}
                onChange={(e) => updateHolder("phone", e.target.value)}
              />
            </div>

            <h3 className="font-semibold border-b pb-2 mt-6">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IGRPInputText
                label="Logradouro"
                required
                value={formData.holder.address.street}
                onChange={(e) => updateAddress("street", e.target.value)}
              />
              <IGRPInputText
                label="Número"
                required
                value={formData.holder.address.number}
                onChange={(e) => updateAddress("number", e.target.value)}
              />
              <IGRPInputText
                label="Bairro"
                required
                value={formData.holder.address.neighborhood}
                onChange={(e) => updateAddress("neighborhood", e.target.value)}
              />
              <IGRPInputText
                label="Cidade"
                required
                value={formData.holder.address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
              />
              <IGRPInputText
                label="Estado"
                required
                value={formData.holder.address.state}
                onChange={(e) => updateAddress("state", e.target.value)}
              />
              <IGRPInputText
                label="CEP"
                required
                value={formData.holder.address.zipCode}
                onChange={(e) => updateAddress("zipCode", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            {onCancel && (
              <IGRPButton variant="outline" onClick={onCancel} type="button">
                Cancelar
              </IGRPButton>
            )}
            <IGRPButton type="submit" disabled={isLoading} variant="default">
              {isLoading ? "Salvando..." : "Salvar Concessão"}
            </IGRPButton>
          </div>
        </form>
      </IGRPCardContent>
    </IGRPCard>
  );
}
