"use client";

import {
  IGRPInputNumber,
  IGRPInputText,
  IGRPSelect,
  IGRPTextarea,
} from "@igrp/igrp-framework-react-design-system";
import { CEMETERY_STATUS, PLOT_TYPE } from "@/app/(myapp)/types/cemetery";

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
            required={true}
          />
        </div>
        <div>
          <IGRPInputText name={"name"} label={"Nome "} required={true} />
        </div>
        <div>
          <IGRPInputText name={"code"} label={"Código "} />
        </div>
        <div>
          <IGRPSelect
            name={"plotType"}
            label={"Tipo"}
            options={PLOT_TYPE.map((value) => ({
              value,
              label:
                value === "GROUND"
                  ? "Solo"
                  : value === "MAUSOLEUM"
                    ? "Mausoléu"
                    : value === "NICHE"
                      ? "Nicho"
                      : "Ossário",
            }))}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2">
          <IGRPTextarea name={"description"} label={"Descrição "} />
        </div>
        <div>
          <IGRPSelect
            name={"status"}
            label={"Status "}
            options={CEMETERY_STATUS.map((value) => ({
              value,
              label:
                value === "ACTIVE"
                  ? "Ativo"
                  : value === "INACTIVE"
                    ? "Inativo"
                    : "Manutenção",
            }))}
            placeholder="Selecione"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <IGRPTextarea
          name={"geoPolygonText"}
          label={"GeoPolygon (JSON) "}
          placeholder={'{ "type": "Polygon", "coordinates": [...] }'}
        />
      </div>
    </>
  );
}
