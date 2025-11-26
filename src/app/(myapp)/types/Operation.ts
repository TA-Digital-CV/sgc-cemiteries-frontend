import type { BaseEntity } from "./Common";

/**
 * Domain constants: Operation types.
 */
export const OPERATION_TYPE = [
  "INHUMATION",
  "EXHUMATION",
  "TRANSFER",
  "MAINTENANCE",
] as const;
export type OperationType = (typeof OPERATION_TYPE)[number];

/**
 * Domain constants: Operation statuses.
 */
export const OPERATION_STATUS = [
  "SCHEDULED",
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OperationStatus = (typeof OPERATION_STATUS)[number];

/**
 * Domain constants: Team types.
 */
export const TEAM_TYPE = [
  "OPERATIONAL",
  "MAINTENANCE",
  "ADMINISTRATIVE",
] as const;
export type TeamType = (typeof TEAM_TYPE)[number];

export interface Team extends BaseEntity {
  name: string;
  type: TeamType;
  members: string[]; // User IDs
  specializations: OperationType[];
}

export interface Operation extends BaseEntity {
  number: string;
  type: OperationType;
  status: OperationStatus;
  scheduledDate: Date;
  completionDate?: Date;
  location: {
    cemeteryId: string;
    sectorId: string;
    blockId: string;
    lotId: string;
    grave?: string;
  };
  team?: Team;
  requesterId: string;
  observations?: string;
}

export interface OperationFilters {
  status?: OperationStatus;
  type?: OperationType;
  startDate?: Date;
  endDate?: Date;
  cemeteryId?: string;
}

export interface Configuration extends BaseEntity {
  scope: "SYSTEM" | "ORGANIZATION" | "CEMETERY" | "TEAM" | "USER";
  targetId?: string; // ID of the organization, cemetery, team or user
  key: string;
  value: any;
  dataType: "STRING" | "NUMBER" | "BOOLEAN" | "JSON";
}

export interface ConfigurationGroup {
  id: string;
  title: string;
  configurations: Configuration[];
}
