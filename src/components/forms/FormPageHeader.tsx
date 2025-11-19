"use client";

import {
  IGRPButton,
  IGRPPageHeader,
} from "@igrp/igrp-framework-react-design-system";

interface FormPageHeaderProps {
  title: string;
  description?: string;
  backUrl: string;
  onSave: () => void;
  saveLabel?: string;
}

/**
 * FormPageHeader
 * Renders a standardized page header for create/edit forms with back button and primary save action.
 */
export function FormPageHeader({
  title,
  description,
  backUrl,
  onSave,
  saveLabel = "Salvar",
}: FormPageHeaderProps) {
  return (
    <IGRPPageHeader
      name={`formPageHeader`}
      iconBackButton={`ArrowLeft`}
      showBackButton={true}
      urlBackButton={backUrl}
      variant={`h3`}
      title={title}
      description={description}
    >
      <div className="flex items-center gap-2">
        <IGRPButton
          variant={`default`}
          size={`default`}
          showIcon={true}
          iconName={`Save`}
          onClick={onSave}
        >
          {saveLabel}
        </IGRPButton>
      </div>
    </IGRPPageHeader>
  );
}
