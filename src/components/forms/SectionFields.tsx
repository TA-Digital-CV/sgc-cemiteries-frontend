"use client";

import {
  IGRPInputNumber,
  IGRPInputText,
  IGRPSelect,
} from "@igrp/igrp-framework-react-design-system";

interface Option {
  value: string;
  label: string;
}

interface SectionFieldsProps {
  blockOptions: Option[];
  capacityFieldName?: "maxCapacity" | "totalPlots";
  capacityLabel?: string;
}

/**
 * SectionFields
 * Renders standardized section form fields for create/edit using IGRP form inputs.
 */
export function SectionFields({
  blockOptions,
  capacityFieldName = "maxCapacity",
  capacityLabel = "Capacidade Máxima ",
}: SectionFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <IGRPSelect
            name={"blockId"}
            label={"Bloco "}
            options={blockOptions}
            placeholder="Selecione"
          />
        </div>
        <div>
          <IGRPInputText name={"name"} label={"Nome "} required={true} />
        </div>
        <div>
          <IGRPInputText name={"code"} label={"Código "} required={true} />
        </div>
        <div>
          <IGRPSelect
            name={"plotType"}
            label={"Tipo "}
            options={[
              { value: "GROUND", label: "Solo" },
              { value: "MAUSOLEUM", label: "Mausoléu" },
              { value: "NICHE", label: "Nicho" },
              { value: "OSSUARY", label: "Ossário" },
            ]}
            placeholder="Tipo"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <IGRPInputNumber
            name={capacityFieldName}
            label={capacityLabel}
            required={true}
            step={1}
          />
        </div>
      </div>
    </>
  );
}
