import { VALIDATION_ERROR } from '../constants';

export const formatResponseError = (error: any): { statusCode: number; body: string } => {
  const isValidationError = error.name === VALIDATION_ERROR;
  const statusCode = isValidationError ? 400 : 500;
  const body = isValidationError
    ? { errors: error?.errors, message: 'Invalid data' }
    : { message: 'Something went wrong' };

  return {
    statusCode,
    body: JSON.stringify(body),
  };
};
