import { formatResponseError } from '../errorHandler';
import { VALIDATION_ERROR } from '../../constants';

describe('errorHandler.formatResponseError', () => {
  it('should return correct response for validation error', () => {
    const mockError = {
      errors: [],
      name: VALIDATION_ERROR,
    };

    const response = formatResponseError(mockError);

    expect(response).toEqual({
      statusCode: 400,
      body: JSON.stringify({ errors: mockError.errors, message: 'Invalid data' }),
    });
  });

  it('should return correct response for other error', () => {
    const mockError = {
      errors: [],
      name: '',
    };

    const response = formatResponseError(mockError);

    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' }),
    });
  });
});
