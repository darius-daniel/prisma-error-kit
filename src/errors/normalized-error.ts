import type {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import type {
  PrismaErrorCategoriesType,
  ExposureType,
  ResolutionStrategyType,
} from "../types";

interface NormalizedPrismaErrorConfig {
  code: string;
  prismaCode: string;
  category: PrismaErrorCategoriesType;
  message: string;
  userMsg: string;
  meta: {};
  cause: string;
  originalError:
    | PrismaClientKnownRequestError
    | PrismaClientInitializationError
    | PrismaClientRustPanicError
    | PrismaClientValidationError
    | PrismaClientUnknownRequestError;
  resolutionStrategy: ResolutionStrategyType;
  exposure: ExposureType;
}

class NormalizedPrismaError extends Error {
  code: string;
  prismaCode: string;
  category: PrismaErrorCategoriesType;
  message: string;
  userMsg: string;
  meta: Record<string, unknown>;
  cause: string;
  originalError:
    | PrismaClientKnownRequestError
    | PrismaClientInitializationError
    | PrismaClientRustPanicError
    | PrismaClientValidationError
    | PrismaClientUnknownRequestError;
  resolutionStrategy: ResolutionStrategyType;
  exposure: ExposureType;

  constructor(error: NormalizedPrismaErrorConfig) {
    super();
    this.code = error.code;
    this.prismaCode = error.prismaCode;
    this.category = error.category;
    this.message = error.message;
    this.userMsg = error.userMsg;
    this.meta = error.meta;
    this.cause = error.cause;
    this.originalError = error.originalError;
    this.resolutionStrategy = error.resolutionStrategy;
    this.exposure = error.exposure;
  }
}

export default NormalizedPrismaError;
