import type {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import type {
  Exposure,
  PrismaErrorCategories,
  ResolutionStrategy,
} from "../types";

class NormalizedPrismaError extends Error {
  code: string;
  prismaCode: string;
  category: typeof PrismaErrorCategories;
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
  resolutionStrategy: typeof ResolutionStrategy;
  exposure: typeof Exposure;

  constructor(
    code: string,
    prismaCode: string,
    category: typeof PrismaErrorCategories,
    message: string,
    userMsg: string,
    meta: {},
    cause: string,
    originalError:
      | PrismaClientKnownRequestError
      | PrismaClientInitializationError
      | PrismaClientRustPanicError
      | PrismaClientValidationError
      | PrismaClientUnknownRequestError,
    resolutionStrategy: typeof ResolutionStrategy,
    exposure: typeof Exposure,
  ) {
    super();
    this.code = code;
    this.prismaCode = prismaCode;
    this.category = category;
    this.message = message;
    this.userMsg = userMsg;
    this.meta = meta;
    this.cause = cause;
    this.originalError = originalError;
    this.resolutionStrategy = resolutionStrategy;
    this.exposure = exposure;
  }
}

export default NormalizedPrismaError;
