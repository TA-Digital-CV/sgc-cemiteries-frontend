"use client";

import {
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPForm,
  type IGRPFormHandle,
} from "@igrp/igrp-framework-react-design-system";
import { useRef } from "react";
import { z } from "zod";
import { FormActions } from "./FormActions";
import { PlotFields } from "./PlotFields";

interface Option {
  value: string;
  label: string;
}

interface PlotFormProps {
  defaultValues: import("@/app/(myapp)/types/Plot").PlotFormData;
  cemeteryOptions: Option[];
  blockOptions: Option[];
  sectionOptions: Option[];
  onSubmit: (data: import("@/app/(myapp)/types/Plot").PlotFormData) => void;
  onCancel: () => void;
  onClear?: () => void;
  loading?: boolean;
  onCemeteryChange?: (id: string) => void;
  onBlockChange?: (id: string) => void;
  onSectionChange?: (id: string) => void;
  title?: string;
}

/**
 * PlotForm
 * Reusable plot form wrapper with IGRPForm + Zod schema, fields and actions.
 */
export function PlotForm({
  defaultValues,
  cemeteryOptions,
  blockOptions,
  sectionOptions,
  onSubmit,
  onCancel,
  onClear,
  loading,
  onCemeteryChange,
  onBlockChange,
  onSectionChange,
  title = "Dados da Sepultura",
}: PlotFormProps) {
  const formRef = useRef<IGRPFormHandle<any> | null>(null);

  const schema = z.object({
    cemeteryId: z.string().min(1, "Cemetery is required"),
    blockId: z.string().min(1, "Block is required"),
    sectionId: z.string().min(1, "Section is required"),
    plotNumber: z.string().min(1, "Plot number is required"),
    plotType: z.enum(["GROUND", "MAUSOLEUM", "NICHE", "OSSUARY"]),
    geoPoint: z.object({
      latitude: z
        .number({ message: "Latitude must be a number" })
        .min(-90)
        .max(90),
      longitude: z
        .number({ message: "Longitude must be a number" })
        .min(-180)
        .max(180),
    }),
    dimensions: z.object({
      width: z
        .number({ message: "Width must be a number" })
        .gt(0, "Width must be greater than 0"),
      length: z
        .number({ message: "Length must be a number" })
        .gt(0, "Length must be greater than 0"),
      unit: z.enum(["meters", "feet"]),
    }),
    notes: z.string().optional(),
  });

  return (
    <IGRPForm
      schema={schema}
      validationMode={"onChange"}
      formRef={formRef}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
    >
      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>{title}</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <PlotFields
            cemeteryOptions={cemeteryOptions}
            blockOptions={blockOptions}
            sectionOptions={sectionOptions}
            onCemeteryChange={onCemeteryChange}
            onBlockChange={onBlockChange}
            onSectionChange={onSectionChange}
          />
          <FormActions
            onCancel={onCancel}
            onSubmit={() => formRef.current?.submit()}
            onClear={onClear}
            cancelLabel="Cancelar"
            submitLabel="Salvar"
            clearLabel="Limpar"
            disabled={Boolean(loading)}
          />
        </IGRPCardContent>
      </IGRPCard>
    </IGRPForm>
  );
}
