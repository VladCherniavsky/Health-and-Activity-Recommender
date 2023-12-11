import { type AxiosResponse } from 'axios';
import { UNITS } from '../../constants';

export type RequestBody = {
  height: {
    value: number;
    unit: UNITS.CM | UNITS.FEET;
  };
  weight: {
    value: number;
    unit: UNITS.KG | UNITS.POUND;
  };
  birthDate?: number;
};

export type RecommendationItem = {
  title: string;
  priority: number;
  details?: string;
};

export type RecommendationError = {
  serviceName: string;
  errorCode: number;
  errorMessage: string;
};

export type GetRecommendationsAndTipsItem = {
  isOk: boolean;
  data?: RecommendationItem[];
  error?: RecommendationError;
};

type Service1Payload = { weight: number; height: number; token: string };
type Service2Payload = { session_token: string; birth_date: number; measurements: { mass: number; height: number } };

export type ServiceConfiguration = {
  name: string;
  endpoint: string;
  mapInputToPayload: (input: RequestBody) => Service1Payload | Service2Payload | undefined;
  mapResponse: (response: AxiosResponse<any>, initialConfig: ServiceConfiguration) => GetRecommendationsAndTipsItem;
  options?: {
    retry?: {
      retries?: number;
    };
  };
};

export type ServiceConfigurationWithPayload = (ServiceConfiguration & { payload: { [key: string]: any } })[];
