"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
  IGRPInputText,
  IGRPLabel,
} from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";
import type { ActionResult } from "@/types/Common";
import type { Cemetery, CemeteryFormData } from "@/types/cemetery";

interface CemeteryFormProps {
  cemetery?: Cemetery;
  onSubmit: (data: CemeteryFormData) => Promise<ActionResult<Cemetery>>;
  onCancel: () => void;
  className?: string;
}

/**
 * CemeteryForm
 *
 * Renders an IGRP-based form for creating or editing cemeteries.
 * Aligns inputs with CemeteryFormData and validates core fields before submit.
 */
export function CemeteryForm({
  cemetery,
  onSubmit,
  onCancel,
  className,
}: CemeteryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<CemeteryFormData>(() => ({
    municipalityId: cemetery?.municipalityId ?? "",
    name: cemetery?.name ?? "",
    address: cemetery?.address ?? "",
    geoPoint: {
      latitude: cemetery?.geoPoint.latitude ?? 0,
      longitude: cemetery?.geoPoint.longitude ?? 0,
    },
    totalArea: cemetery?.totalArea ?? 0,
    maxCapacity: cemetery?.maxCapacity ?? 0,
    metadata: {
      contact: {
        phone: cemetery?.metadata?.contact?.phone ?? "",
        email: cemetery?.metadata?.contact?.email ?? "",
        responsible: cemetery?.metadata?.contact?.responsible ?? "",
      },
    },
  }));

  const validate = (): string | null => {
    if (!formData.municipalityId.trim()) return "Municipality ID is required";
    if (!formData.name.trim()) return "Name is required";
    if (!formData.address.trim()) return "Address is required";
    if (!Number.isFinite(formData.geoPoint.latitude))
      return "Latitude must be a number";
    if (!Number.isFinite(formData.geoPoint.longitude))
      return "Longitude must be a number";
    if (formData.geoPoint.latitude < -90 || formData.geoPoint.latitude > 90)
      return "Latitude must be between -90 and 90";
    if (formData.geoPoint.longitude < -180 || formData.geoPoint.longitude > 180)
      return "Longitude must be between -180 and 180";
    if (!Number.isFinite(formData.totalArea) || formData.totalArea <= 0)
      return "Total area must be greater than 0";
    if (!Number.isFinite(formData.maxCapacity) || formData.maxCapacity <= 0)
      return "Max capacity must be greater than 0";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const cleaned: CemeteryFormData = {
        ...formData,
        metadata:
          formData.metadata &&
          formData.metadata.contact &&
          (formData.metadata.contact.phone ||
            formData.metadata.contact.email ||
            formData.metadata.contact.responsible)
            ? formData.metadata
            : undefined,
      };

      const result = await onSubmit(cleaned);
      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        setSubmitError(result.errors?.[0] || "Failed to save cemetery");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save cemetery",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <IGRPCardTitle>
          {cemetery ? "Editar Cemitério" : "Novo Cemitério"}
        </IGRPCardTitle>
        <IGRPCardDescription>
          {cemetery
            ? "Atualize as informações do cemitério"
            : "Preencha os dados do novo cemitério"}
        </IGRPCardDescription>
      </IGRPCardHeader>
      <IGRPCardContent className="space-y-6">
        {submitError && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <IGRPIcon iconName="AlertTriangle" className="h-4 w-4" />
            <span className="text-sm">{submitError}</span>
          </div>
        )}
        {submitSuccess && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <IGRPIcon iconName="CheckCircle" className="h-4 w-4" />
            <span className="text-sm">Cemitério salvo com sucesso</span>
          </div>
        )}

        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações Básicas</h3>
          <div>
            <IGRPLabel htmlFor="municipalityId">ID do Município *</IGRPLabel>
            <IGRPInputText
              id="municipalityId"
              value={formData.municipalityId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  municipalityId: e.target.value,
                }))
              }
              placeholder="Municipality_001"
            />
          </div>
          <div>
            <IGRPLabel htmlFor="name">Nome do Cemitério *</IGRPLabel>
            <IGRPInputText
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Cemitério Municipal"
            />
          </div>
          <div>
            <IGRPLabel htmlFor="address">Endereço *</IGRPLabel>
            <IGRPInputText
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Rua Exemplo, 123 - Centro, Cidade/UF"
            />
          </div>
        </div>

        {/* Localização e Área */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Localização e Área</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <IGRPLabel htmlFor="latitude">Latitude *</IGRPLabel>
              <IGRPInputText
                id="latitude"
                value={String(formData.geoPoint.latitude)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    geoPoint: {
                      ...prev.geoPoint,
                      latitude: Number(e.target.value),
                    },
                  }))
                }
                placeholder="-23.550520"
              />
            </div>
            <div>
              <IGRPLabel htmlFor="longitude">Longitude *</IGRPLabel>
              <IGRPInputText
                id="longitude"
                value={String(formData.geoPoint.longitude)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    geoPoint: {
                      ...prev.geoPoint,
                      longitude: Number(e.target.value),
                    },
                  }))
                }
                placeholder="-46.633308"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <IGRPLabel htmlFor="totalArea">Área Total (m²) *</IGRPLabel>
              <IGRPInputText
                id="totalArea"
                value={String(formData.totalArea)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalArea: Number(e.target.value),
                  }))
                }
                placeholder="50000"
              />
            </div>
            <div>
              <IGRPLabel htmlFor="maxCapacity">Capacidade Máxima *</IGRPLabel>
              <IGRPInputText
                id="maxCapacity"
                value={String(formData.maxCapacity)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxCapacity: Number(e.target.value),
                  }))
                }
                placeholder="10000"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <IGRPLabel htmlFor="phone">Telefone</IGRPLabel>
              <IGRPInputText
                id="phone"
                value={formData.metadata?.contact?.phone ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: {
                      contact: {
                        ...(prev.metadata?.contact ?? {}),
                        phone: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <IGRPLabel htmlFor="email">Email</IGRPLabel>
              <IGRPInputText
                id="email"
                value={formData.metadata?.contact?.email ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: {
                      contact: {
                        ...(prev.metadata?.contact ?? {}),
                        email: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="contato@cemiterio.br"
              />
            </div>
            <div>
              <IGRPLabel htmlFor="responsible">Responsável</IGRPLabel>
              <IGRPInputText
                id="responsible"
                value={formData.metadata?.contact?.responsible ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: {
                      contact: {
                        ...(prev.metadata?.contact ?? {}),
                        responsible: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="Nome do responsável"
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <IGRPButton variant="outline" onClick={onCancel} type="button">
            Cancelar
          </IGRPButton>
          <IGRPButton
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-24"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <IGRPIcon iconName="Save" className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </IGRPButton>
        </div>
      </IGRPCardContent>
    </IGRPCard>
  );
}
