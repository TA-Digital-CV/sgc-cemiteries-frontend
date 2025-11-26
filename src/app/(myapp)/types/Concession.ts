import type { BaseEntity } from "./Common";

/**
 * Domain constants: Concession status values.
 */
export const CONCESSION_STATUS = [
  "ACTIVE",
  "EXPIRED",
  "SUSPENDED",
  "CANCELLED",
  "PENDING_RENEWAL",
  "PENDING_TRANSFER",
] as const;
export type ConcessionStatus = (typeof CONCESSION_STATUS)[number];

/**
 * Domain constants: Person type classification.
 */
export const PERSON_TYPE = ["INDIVIDUAL", "LEGAL_ENTITY"] as const;
export type PersonType = (typeof PERSON_TYPE)[number];

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Person extends BaseEntity {
  name: string;
  document: string; // CPF/CNPJ
  email: string;
  phone: string;
  address: Address;
  type: PersonType;
}

export interface CemeteryLocation {
  id: string;
  sector: string;
  block: string;
  lot: string;
  grave?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ConcessionType extends BaseEntity {
  name: string;
  duration: number; // em anos
  renewable: boolean;
  transferable: boolean;
  baseValue: number;
  requiredDocuments: string[];
}

export interface Document extends BaseEntity {
  name: string;
  url: string;
  type: string;
}

export interface WorkflowInstance extends BaseEntity {
  entityId: string;
  entityType: string;
  currentStep: string;
  status: string;
}

export interface Concession extends BaseEntity {
  number: string;
  type: ConcessionType;
  holder: Person;
  location: CemeteryLocation;
  status: ConcessionStatus;
  startDate: Date;
  expiryDate: Date;
  value: number;
  documents: Document[];
  workflow?: WorkflowInstance;
}

export interface ConcessionFilters {
  status?: ConcessionStatus;
  holderName?: string;
  startDate?: Date;
  endDate?: Date;
}

// Form Data Types
export interface AddressFormData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PersonFormData {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: AddressFormData;
  type: PersonType;
}

export interface LocationFormData {
  cemeteryId: string;
  sectorId: string;
  blockId: string;
  lotId: string;
}

export interface FileUpload {
  file: File;
  type: string;
}

export interface ConcessionFormData {
  typeId: string;
  holder: PersonFormData;
  location: LocationFormData;
  duration?: number;
  observations?: string;
  documents: FileUpload[];
}
