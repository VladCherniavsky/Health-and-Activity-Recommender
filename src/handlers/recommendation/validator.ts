import { type InferType, mixed, number, object } from 'yup';
import moment from 'moment';
import { UNITS, VALIDATION_ERROR } from '../../constants';

export const requestBodySchema = object().shape({
  weight: object({
    value: number().required(),
    unit: mixed().oneOf([UNITS.KG, UNITS.POUND]).required(),
  }).required(),
  height: object({
    value: number().required(),
    unit: mixed().oneOf([UNITS.CM, UNITS.FEET]).required(),
  }).required(),
  birthDate: number().test('isValidUnixTime', '${path} is not valid unix date', (value) => {
    return value ? moment(value, 'X', true).isValid() : true;
  }),
});

export type RequestBody = InferType<typeof requestBodySchema>;

export const validateRequestBody = async (payload: string | null): Promise<RequestBody> => {
  try {
    const body = typeof payload === 'string' ? JSON.parse(payload) : payload;
    return await requestBodySchema.validate(body);
  } catch (error: any) {
    error.name = VALIDATION_ERROR;
    throw error;
  }
};
