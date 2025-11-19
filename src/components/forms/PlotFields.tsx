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

interface PlotFieldsProps {
  cemeteryOptions: Option[];
  blockOptions: Option[];
  sectionOptions: Option[];
  onCemeteryChange?: (id: string) => void;
  onBlockChange?: (id: string) => void;
  onSectionChange?: (id: string) => void;
}

/**
 * PlotFields
 * Reusable plot form fields (create/edit) using IGRP form inputs.
 * Includes cemetery, block, section selects, identification and location fields.
 */
export function PlotFields({
  cemeteryOptions,
  blockOptions,
  sectionOptions,
  onCemeteryChange,
  onBlockChange,
  onSectionChange,
}: PlotFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <IGRPSelect
            name={"cemeteryId"}
            label={"Cemitério"}
            options={cemeteryOptions}
            placeholder="Selecione o Cemitério"
            onValueChange={(v) => onCemeteryChange?.(String(v))}
          />
        </div>
        <div>
          <IGRPSelect
            name={"blockId"}
            label={"Bloco"}
            options={blockOptions}
            placeholder="Selecione o Bloco"
            onValueChange={(v) => onBlockChange?.(String(v))}
          />
        </div>
        <div>
          <IGRPSelect
            name={"sectionId"}
            label={"Setor"}
            options={sectionOptions}
            placeholder="Selecione a Seção"
            onValueChange={(v) => onSectionChange?.(String(v))}
          />
        </div>
        <div>
          <IGRPInputText name={"plotNumber"} label={"Número"} required={true} />
        </div>
        <div>
          <IGRPSelect
            name={"plotType"}
            label={"Tipo"}
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
            name={"geoPoint.latitude"}
            label={"Latitude"}
            required={true}
            step={0.000001}
          />
        </div>
        <div>
          <IGRPInputNumber
            name={"geoPoint.longitude"}
            label={"Longitude"}
            required={true}
            step={0.000001}
          />
        </div>
        <div>
          <IGRPSelect
            name={"dimensions.unit"}
            label={"Unidade"}
            options={[
              { value: "meters", label: "Metros" },
              { value: "feet", label: "Pés" },
            ]}
            placeholder="Unidade"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <IGRPInputNumber
            name={"dimensions.width"}
            label={"Dimensão - Largura"}
            required={true}
            step={0.1}
          />
        </div>
        <div>
          <IGRPInputNumber
            name={"dimensions.length"}
            label={"Dimensão - Comprimento"}
            required={true}
            step={0.1}
          />
        </div>
        <div>
          <IGRPInputText name={"notes"} label={"Observações"} />
        </div>
      </div>
    </>
  );
}
