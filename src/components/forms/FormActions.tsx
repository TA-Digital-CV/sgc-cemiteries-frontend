"use client";

import { IGRPButton } from "@igrp/igrp-framework-react-design-system";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  onClear?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  clearLabel?: string;
  disabled?: boolean;
}

/**
 * FormActions
 * Renders a standardized action row with optional Clear, Cancel and primary Submit buttons.
 */
export function FormActions({
  onCancel,
  onSubmit,
  onClear,
  cancelLabel = "Cancelar",
  submitLabel = "Salvar",
  clearLabel = "Limpar",
  disabled = false,
}: FormActionsProps) {
  return (
    <div className="mt-6 flex gap-2">
      {onClear && (
        <IGRPButton variant="outline" onClick={onClear} type="button">
          {clearLabel}
        </IGRPButton>
      )}
      <IGRPButton variant="outline" onClick={onCancel} type="button">
        {cancelLabel}
      </IGRPButton>
      <IGRPButton onClick={onSubmit} disabled={disabled}>
        {submitLabel}
      </IGRPButton>
    </div>
  );
}
