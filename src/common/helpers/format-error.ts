import { GraphQLFormattedError } from "graphql";
import { ApplicationError } from "../exceptions/application-error";

export const formatGraphqlError = (
  formattedError: GraphQLFormattedError,
  error: unknown
) => {
  let message =
    error instanceof ApplicationError ? error.message : formattedError.message;

  const databaseErrorRegex =
    /(constraint|unique constraint|inconsistent column|foreign key)/gim;
  if (message.match(databaseErrorRegex)?.length > 0) {
    message = "Internal server error.";
  }

  const tag =
    error instanceof ApplicationError
      ? error.tag
      : formattedError.extensions.code;

  switch (tag) {
    case "BAD_REQUEST": {
      const originalError = formattedError.extensions.originalError;
      const errors =
        originalError instanceof Object && "message" in originalError
          ? originalError.message
          : [];

      return {
        message,
        tag,
        errors: Array.isArray(errors) ? errors : [errors],
      };
    }

    case "GRAPHQL_VALIDATION_FAILED": {
      const formatValidationField = (message: string) => {
        return message
          .toUpperCase()
          .replace(/FIELD\s"[A-Z]*\./i, "")
          .replace(/"\sOF\sREQUIRED\sTYPE\s"[A-Z]*.".*/i, "");
      };

      return {
        message: message,
        field: formatValidationField(message),
        tag,
      };
    }

    default:
      return {
        message,
        tag,
      };
  }
};
