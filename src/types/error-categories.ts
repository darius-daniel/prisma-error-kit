const PrismaErrorCategories = {
  VALIDATION: "VALIDATION",
  INTEGRITY: "INTEGRITY",
  CONSTRAINT_VIOLATION: "CONSTRAINT VIOLATION",
  NOT_FOUND: "NOT FOUND",
  CONNECTION: "CONNECTION",
  TRANSACTION: "TRANSACTION",
  QUERY: "QUERY",
  SCHEMA_MISMATCH: "SCHEMA MISMATCH",
  DRIVER: "DRIVER",
  UNKNOWN: "UNKNOWN",
  CONFIG: "CONFIGURATION",
} as const;

export type PrismaErrorCategoriesType =
  (typeof PrismaErrorCategories)[keyof typeof PrismaErrorCategories];

export default PrismaErrorCategories;
