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
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from "react";
import { z } from "zod";
import type { ActionResult } from "@/app/(myapp)/types/Common";
import type { Cemetery, CemeteryFormData } from "@/app/(myapp)/types/cemetery";

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
/**
 * CemeteryForm
 *
 * Standardized IGRP form component for creating or editing cemeteries.
 * Uses IGRPForm + Zod schema for validation and preserves existing behavior.
 */
export function CemeteryForm({
  cemetery,
  onSubmit,
  onCancel,
  className,
}: CemeteryFormProps) {
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [_submitError, setSubmitError] = useState<string | null>(null);
  const [_submitSuccess, setSubmitSuccess] = useState(false);
  const { igrpToast } = useIGRPToast();

  // Zod schema aligned to current validations and nested structure
  const formCemetery = z.object({
    municipalityId: z.string().min(1, "Municipality ID is required"),
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    geoPoint: z.object({
      latitude: z
        .number({ message: "Latitude must be a number" })
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),
      longitude: z
        .number({ message: "Longitude must be a number" })
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
    }),
    totalArea: z
      .number({ message: "Total area must be a number" })
      .gt(0, "Total area must be greater than 0"),
    maxCapacity: z
      .number({ message: "Max capacity must be a number" })
      .gt(0, "Max capacity must be greater than 0"),
    metadata: z
      .object({
        contact: z
          .object({
            phone: z.string().optional(),
            email: z.string().email().optional(),
            responsible: z.string().optional(),
          })
          .partial(),
      })
      .partial()
      .optional(),
  });

  type CemeteryFormZodType = typeof formCemetery;

  const initFormCemetery: z.infer<CemeteryFormZodType> = {
    municipalityId:
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
    metadata: {
      contact: {
        phone: cemetery?.metadata?.contact?.phone ?? "",
        email: cemetery?.metadata?.contact?.email ?? "",
        responsible: cemetery?.metadata?.contact?.responsible ?? "",
      },
    },
  };

  const formCemeteryRef = useRef<IGRPFormHandle<CemeteryFormZodType> | null>(
    null,
  );
  const [cemeteryFormData, _setCemeteryFormData] = useState(initFormCemetery);

  /**
   * onSubmitCemetery
   *
   * Handles validated form submission, cleans optional metadata,
   * and invokes external onSubmit.
   */
  const onSubmitCemetery = async (rawData: z.infer<CemeteryFormZodType>) => {
    const cleaned: CemeteryFormData = {
      ...rawData,
      metadata:
        rawData.metadata?.contact &&
        (rawData.metadata.contact.phone ||
          rawData.metadata.contact.email ||
          rawData.metadata.contact.responsible)
          ? rawData.metadata
          : undefined,
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
                required={false}
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

        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle>Contato</IGRPCardTitle>
          </IGRPCardHeader>

          <IGRPCardContent>
            {/* Contato */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <IGRPInputText
                    name={"metadata.contact.phone"}
                    label={"Telefone"}
                    placeholder={"(11) 99999-9999"}
                  ></IGRPInputText>
                </div>
                <div>
                  <IGRPInputText
                    name={"metadata.contact.email"}
                    label={"Email"}
                    placeholder={"contato@cemiterio.br"}
                  ></IGRPInputText>
                </div>
                <div>
                  <IGRPInputText
                    name={"metadata.contact.responsible"}
                    label={"Responsável"}
                    placeholder={"Nome do responsável"}
                  ></IGRPInputText>
                </div>
              </div>
            </div>
          </IGRPCardContent>
        </IGRPCard>
      </IGRPForm>
    </div>
  );
}
