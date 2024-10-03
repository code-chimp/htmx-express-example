import { FieldValidationError, ValidationError } from 'express-validator';

export function createContactErrors(
  errors: ValidationError[],
  previous: Record<string, string[]> = {},
): Record<string, string[]> {
  return errors
    .filter(e => e.type === 'field')
    .reduce((acc, error: FieldValidationError) => {
      if (!acc[error.path]) {
        acc[error.path] = [];
      }

      acc[error.path].push(error.msg);

      return acc;
    }, previous);
}
