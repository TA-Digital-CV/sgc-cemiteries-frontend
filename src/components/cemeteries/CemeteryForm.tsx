"use client";

import {
  cn,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPForm,
  type IGRPFormHandle,
  IGRPInputHidden,
  IGRPInputNumber,
  IGRPInputText,
  IGRPPageHeader,
  IGRPSelect,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import type { ActionResult } from "@/app/(myapp)/types/Common";
import type {
  Cemetery,
  CemeteryFormData,
  CemeteryStatus,
} from "@/app/(myapp)/types/cemetery";
import {
  CemeteryFormSchema,
  CEMETERY_STATUS,
} from "@/app/(myapp)/types/cemetery";

interface CemeteryFormProps {
  cemetery?: Cemetery;
  municipalityId?: string;
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
/**
 * CemeteryForm
 *
 * Standardized IGRP form component for creating or editing cemeteries.
 * Uses IGRPForm + Zod schema for validation and preserves existing behavior.
 */
export function CemeteryForm({
  cemetery,
  municipalityId,
  onSubmit,
  onCancel,
  className,
}: CemeteryFormProps) {
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [_submitError, setSubmitError] = useState<string | null>(null);
  const [_submitSuccess, setSubmitSuccess] = useState(false);
  const { igrpToast } = useIGRPToast();

  // Zod schema aligned to shared validation rules
  const formCemetery = CemeteryFormSchema;

  type CemeteryFormZodType = typeof formCemetery;

  const initFormCemetery: z.infer<CemeteryFormZodType> = {
    municipalityId:
      municipalityId ??
      cemetery?.municipalityId ??
      (process.env.NEXT_PUBLIC_MUNICIPALITY_ID || ""),
    name: cemetery?.name ?? "",
    address: cemetery?.address ?? "",
    geoPoint: {
      latitude: cemetery?.geoPoint?.latitude ?? 0,
      longitude: cemetery?.geoPoint?.longitude ?? 0,
    },
    totalArea: cemetery?.totalArea ?? 0,
    maxCapacity: cemetery?.maxCapacity ?? 0,
    status: (cemetery?.status ?? "ACTIVE") as CemeteryStatus,
  };

  const formCemeteryRef = useRef<IGRPFormHandle<CemeteryFormZodType> | null>(
    null,
  );
  const [cemeteryFormData, _setCemeteryFormData] = useState(initFormCemetery);

  /**
   * syncMunicipality
   * Updates municipalityId in form state when context changes.
   */
  useEffect(() => {
    if (municipalityId && municipalityId !== cemeteryFormData.municipalityId) {
      _setCemeteryFormData((prev) => ({ ...prev, municipalityId }));
    }
  }, [municipalityId, cemeteryFormData.municipalityId]);

  /**
   * onSubmitCemetery
   *
   * Handles validated form submission, cleans optional metadata,
   * and invokes external onSubmit.
   */
  const onSubmitCemetery = async (rawData: z.infer<CemeteryFormZodType>) => {
    const cleaned: CemeteryFormData = {
      municipalityId: rawData.municipalityId.trim(),
      name: rawData.name.trim(),
      address: rawData.address.trim(),
      geoPoint: {
        latitude: rawData.geoPoint.latitude,
        longitude: rawData.geoPoint.longitude,
      },
      totalArea: rawData.totalArea,
      maxCapacity: rawData.maxCapacity,
      status: rawData.status as CemeteryStatus,
    };

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await onSubmit(cleaned);
      if (result.success) {
        setSubmitSuccess(true);
        igrpToast({
          title: "Sucesso",
          description: "Cemitério salvo com sucesso",
          type: "success",
        });
        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        const err = result.errors?.[0] || "Failed to save cemetery";
        setSubmitError(err);
        igrpToast({ title: "Erro", description: err, type: "error" });
      }
    } catch (error) {
      const err =
        error instanceof Error ? error.message : "Failed to save cemetery";
      setSubmitError(err);
      igrpToast({ title: "Erro", description: err, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // IGRPForm manages validation, submit via onSubmitCemetery

  return (
    <div className={cn("component", className)}>
      <div className="container mx-auto p-6 space-y-6">
        <IGRPPageHeader
          name={`pageHeader1`}
          iconBackButton={`ArrowLeft`}
          showBackButton={true}
          urlBackButton={`/cemeteries`}
          variant={`h3`}
          className={cn()}
          title={cemetery ? "Editar Cemitério" : "Novo Cemitério"}
        >
          <div className="flex items-center gap-2">
            <IGRPButton
              name={`button2`}
              variant={`default`}
              size={`default`}
              showIcon={true}
              iconName={`Save`}
              className={cn()}
              onClick={() => formCemeteryRef.current?.submit()}
            >
              Salvar
            </IGRPButton>
          </div>
        </IGRPPageHeader>

        <IGRPForm
          schema={formCemetery}
          validationMode={"onBlur"}
          formRef={formCemeteryRef}
          onSubmit={onSubmitCemetery}
          defaultValues={cemeteryFormData}
        >
          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle>Informações Básicas</IGRPCardTitle>
            </IGRPCardHeader>
            <IGRPCardContent>
              {/* Informações Básicas */}
              <div className="space-y-4">
                <IGRPInputHidden
                  name={"municipalityId"}
                  label={"municipalityId"}
                  required={true}
                ></IGRPInputHidden>
                <IGRPInputText
                  name={"name"}
                  label={"Nome do Cemitério"}
                  required={true}
                  placeholder={"Cemitério Municipal"}
                ></IGRPInputText>
                <IGRPInputText
                  name={"address"}
                  label={"Endereço"}
                  required={true}
                  placeholder={"Rua Exemplo, 123 - Centro, Cidade/UF"}
                ></IGRPInputText>
                <div>
                  <IGRPSelect
                    name={"status"}
                    label={"Status"}
                    required={true}
                    options={CEMETERY_STATUS.map((value) => ({
                      value,
                      label:
                        value === "ACTIVE"
                          ? "Ativo"
                          : value === "INACTIVE"
                            ? "Inativo"
                            : "Manutenção",
                    }))}
                    placeholder={"Selecione o status"}
                  />
                </div>
              </div>
            </IGRPCardContent>
          </IGRPCard>

          <IGRPCard>
            <IGRPCardHeader>
              <IGRPCardTitle>Localização e Área</IGRPCardTitle>
            </IGRPCardHeader>
            <IGRPCardContent>
              {/* Localização e Área */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <IGRPInputNumber
                      name={"geoPoint.latitude"}
                      label={"Latitude"}
                      required={true}
                      step={0.000001}
                      placeholder={"-23.550520"}
                    ></IGRPInputNumber>
                  </div>
                  <div>
                    <IGRPInputNumber
                      name={"geoPoint.longitude"}
                      label={"Longitude"}
                      required={true}
                      step={0.000001}
                      placeholder={"-46.633308"}
                    ></IGRPInputNumber>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <IGRPInputNumber
                      name={"totalArea"}
                      label={"Área Total (m²)"}
                      required={true}
                      step={1}
                      placeholder={"50000"}
                    ></IGRPInputNumber>
                  </div>
                  <div>
                    <IGRPInputNumber
                      name={"maxCapacity"}
                      label={"Capacidade Máxima"}
                      required={true}
                      step={1}
                      placeholder={"10000"}
                    ></IGRPInputNumber>
                  </div>
                </div>
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {/* Removed non-essential fields to match API payload */}
        </IGRPForm>
      </div>
    </div>
  );
}
