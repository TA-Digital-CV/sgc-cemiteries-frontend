"use client";

import {
  IGRPInputNumber,
  IGRPInputText,
} from "@igrp/igrp-framework-react-design-system";

interface BlockFieldsProps {
  showDescription?: boolean;
}

/**
 * BlockFields
 * Renders standardized block form fields for create/edit using IGRP form inputs.
 */
export function BlockFields({ showDescription = false }: BlockFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <IGRPInputText name={"name"} label={"Nome"} required={true} />
      </div>
      <div>
        <IGRPInputNumber
          name="maxCapacity"
          label="Capacidade Máxima"
          required={true}
          step={1}
        />
      </div>
      {showDescription && (
        <div className="col-span-2">
          <IGRPInputText name={"description"} label={"Descrição"} />
        </div>
      )}
    </div>
  );
}
