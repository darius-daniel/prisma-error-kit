import { describe, expect, it } from "vitest";
import NormalizedPrismaError from "../src/errors/normalized-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import PrismaErrorCategories from "../src/types/error-categories";
import ResolutionStrategy from "../src/types/resolution-strategy";
import Exposure from "../src/types/exposure";

describe("NormalizedPrismaError", () => {
  it("constructs with all properties", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Unique constraint failed on field: email",
      { code: "P2002", clientVersion: "4.0.0" }
    );

    const normalized = new NormalizedPrismaError({
      code: "UNIQUE_CONSTRAINT_VIOLATION",
      prismaCode: "P2002",
      category: PrismaErrorCategories.CONSTRAINT_VIOLATION,
      message: "A record with this email already exists",
      userMsg: "This email is already registered",
      meta: { field: "email" },
      cause: "Duplicate value in unique field",
      originalError,
      resolutionStrategy: ResolutionStrategy.REJECT_INPUT,
      exposure: Exposure.SANITIZED,
    });

    expect(normalized.code).toBe("UNIQUE_CONSTRAINT_VIOLATION");
    expect(normalized.prismaCode).toBe("P2002");
    expect(normalized.category).toBe(PrismaErrorCategories.CONSTRAINT_VIOLATION);
    expect(normalized.message).toBe(
      "A record with this email already exists"
    );
    expect(normalized.userMsg).toBe("This email is already registered");
    expect(normalized.meta).toEqual({ field: "email" });
    expect(normalized.cause).toBe("Duplicate value in unique field");
    expect(normalized.originalError).toBe(originalError);
    expect(normalized.resolutionStrategy).toBe(ResolutionStrategy.REJECT_INPUT);
    expect(normalized.exposure).toBe(Exposure.SANITIZED);
  });

  it("extends Error class", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Test",
      { code: "P2025", clientVersion: "4.0.0" }
    );

    const normalized = new NormalizedPrismaError({
      code: "RECORD_NOT_FOUND",
      prismaCode: "P2025",
      category: PrismaErrorCategories.NOT_FOUND,
      message: "Record not found",
      userMsg: "Resource not found",
      meta: {},
      cause: "No matching record",
      originalError,
      resolutionStrategy: ResolutionStrategy.RETURN_NOT_FOUND,
      exposure: Exposure.SAFE,
    });

    expect(normalized).toBeInstanceOf(Error);
  });

  it("handles empty metadata", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Test",
      { code: "P2000", clientVersion: "4.0.0" }
    );

    const normalized = new NormalizedPrismaError({
      code: "VALUE_TOO_LONG",
      prismaCode: "P2000",
      category: PrismaErrorCategories.VALIDATION,
      message: "Value too long",
      userMsg: "Input is too long",
      meta: {},
      cause: "Column length exceeded",
      originalError,
      resolutionStrategy: ResolutionStrategy.REJECT_INPUT,
      exposure: Exposure.SAFE,
    });

    expect(normalized.meta).toEqual({});
  });

  it("preserves complex metadata", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Foreign key constraint failed",
      { code: "P2003", clientVersion: "4.0.0" }
    );

    const metadata = {
      field: "userId",
      table: "posts",
      constraint: "posts_userId_fkey",
      values: [123, 456],
      details: {
        nested: "value",
      },
    };

    const normalized = new NormalizedPrismaError({
      code: "FOREIGN_KEY_CONSTRAINT_VIOLATION",
      prismaCode: "P2003",
      category: PrismaErrorCategories.CONSTRAINT_VIOLATION,
      message: "Foreign key constraint failed",
      userMsg: "Operation failed due to related records",
      meta: metadata,
      cause: "Invalid reference",
      originalError,
      resolutionStrategy: ResolutionStrategy.INVESTIGATE,
      exposure: Exposure.INTERNAL,
    });

    expect(normalized.meta).toEqual(metadata);
  });

  it("handles different exposure levels", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Test",
      { code: "P2025", clientVersion: "4.0.0" }
    );

    const exposures = [Exposure.SAFE, Exposure.SANITIZED, Exposure.INTERNAL];

    for (const exposure of exposures) {
      const normalized = new NormalizedPrismaError({
        code: "TEST",
        prismaCode: "P2025",
        category: PrismaErrorCategories.NOT_FOUND,
        message: "Test",
        userMsg: "Test",
        meta: {},
        cause: "Test",
        originalError,
        resolutionStrategy: ResolutionStrategy.RETURN_NOT_FOUND,
        exposure,
      });

      expect(normalized.exposure).toBe(exposure);
    }
  });

  it("handles different resolution strategies", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Test",
      { code: "P2034", clientVersion: "4.0.0" }
    );

    const strategies = [
      ResolutionStrategy.RETRY,
      ResolutionStrategy.REJECT_INPUT,
      ResolutionStrategy.RETURN_NOT_FOUND,
      ResolutionStrategy.RESOLVE_CONFLICT,
      ResolutionStrategy.FIX_SCHEMA,
      ResolutionStrategy.FIX_CONFIG,
      ResolutionStrategy.INVESTIGATE,
    ];

    for (const strategy of strategies) {
      const normalized = new NormalizedPrismaError({
        code: "TEST",
        prismaCode: "P2034",
        category: PrismaErrorCategories.TRANSACTION,
        message: "Test",
        userMsg: "Test",
        meta: {},
        cause: "Test",
        originalError,
        resolutionStrategy: strategy,
        exposure: Exposure.SAFE,
      });

      expect(normalized.resolutionStrategy).toBe(strategy);
    }
  });

  it("handles all error categories", () => {
    const originalError = new PrismaClientKnownRequestError(
      "Test",
      { code: "P2000", clientVersion: "4.0.0" }
    );

    const categories = [
      PrismaErrorCategories.VALIDATION,
      PrismaErrorCategories.INTEGRITY,
      PrismaErrorCategories.CONSTRAINT_VIOLATION,
      PrismaErrorCategories.NOT_FOUND,
      PrismaErrorCategories.CONNECTION,
      PrismaErrorCategories.TRANSACTION,
      PrismaErrorCategories.QUERY,
      PrismaErrorCategories.SCHEMA_MISMATCH,
      PrismaErrorCategories.DRIVER,
      PrismaErrorCategories.UNKNOWN,
      PrismaErrorCategories.CONFIG,
    ];

    for (const category of categories) {
      const normalized = new NormalizedPrismaError({
        code: "TEST",
        prismaCode: "P2000",
        category,
        message: "Test",
        userMsg: "Test",
        meta: {},
        cause: "Test",
        originalError,
        resolutionStrategy: ResolutionStrategy.INVESTIGATE,
        exposure: Exposure.SAFE,
      });

      expect(normalized.category).toBe(category);
    }
  });
});
