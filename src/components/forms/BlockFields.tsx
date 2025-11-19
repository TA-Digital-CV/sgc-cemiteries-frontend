"use client";

import {
  IGRPInputNumber,
  IGRPInputText,
} from "@igrp/igrp-framework-react-design-system";

interface BlockFieldsProps {
  capacityFieldName?: "maxCapacity" | "totalPlots";
  capacityLabel?: string;
}

/**
 * BlockFields
 * Renders standardized block form fields for create/edit using IGRP form inputs.
 */
export function BlockFields({
  capacityFieldName = "maxCapacity",
  capacityLabel = "Capacidade Máxima ",
}: BlockFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <IGRPInputText name={"name"} label={"Nome "} required={true} />
      </div>
      <div>
        <IGRPInputText name={"code"} label={"Código "} required={true} />
      </div>
      <div>
        <IGRPInputNumber
          name={capacityFieldName}
          label={capacityLabel}
          required={true}
          step={1}
        />
      </div>
    </div>
  );
}
