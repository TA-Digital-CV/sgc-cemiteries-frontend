import type { BaseEntity } from "./Common";

/**
 * Domain constants: Payment status values.
 */
export const PAYMENT_STATUS = [
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

/**
 * Domain constants: Payment methods supported.
 */
export const PAYMENT_METHOD = [
  "CASH",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "PIX",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

export interface FeeTable extends BaseEntity {
  code: string;
  description: string;
  value: number;
  effectiveDate: Date;
  category: string;
  active: boolean;
}

export interface CalculationResult {
  baseValue: number;
  additions: number;
  discounts: number;
  total: number;
  details: {
    description: string;
    value: number;
    type: "ADDITION" | "DISCOUNT" | "BASE";
  }[];
}

export interface Payment extends BaseEntity {
  number: string;
  entityId: string; // Concession or Operation ID
  entityType: "CONCESSION" | "OPERATION";
  payer: {
    name: string;
    document: string;
  };
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status: PaymentStatus;
  method?: PaymentMethod;
  items: {
    feeTableId: string;
    description: string;
    quantity: number;
    unitValue: number;
    total: number;
  }[];
}

export interface Reconciliation extends BaseEntity {
  date: Date;
  bankAccount: string;
  totalSystem: number;
  totalBank: number;
  difference: number;
  status: "MATCHED" | "UNMATCHED";
  items: {
    paymentId?: string;
    bankTransactionId?: string;
    amount: number;
    status: "MATCHED" | "PENDING_SYSTEM" | "PENDING_BANK";
  }[];
}

export interface FinancialFilters {
  startDate?: Date;
  endDate?: Date;
  status?: PaymentStatus;
  entityType?: string;
}
