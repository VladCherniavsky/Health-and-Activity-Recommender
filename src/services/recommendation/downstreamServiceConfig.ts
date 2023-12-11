import { UNITS } from '../../constants';
import { convertHeight, convertWeight } from './utils/unit';
import { ServiceConfiguration, RecommendationItem, RecommendationError } from './types';

const service1: ServiceConfiguration = {
  name: 'service1',
  endpoint: 'https://gozmvpzh6vaifsur2bjw4k7wcu0fgjsy.lambda-url.eu-central-1.on.aws/services/service1',
  mapInputToPayload: (input) => {
    const expectedHeightUnit = UNITS.CM;
    const expectedWeightUnit = UNITS.KG;

    return {
      weight: convertWeight(input.weight, expectedWeightUnit),
      height: convertHeight(input.height, expectedHeightUnit),
      token: 'service1-dev',
    };
  },
  mapResponse: (response, initialConfig) => {
    const isOk = response.data.statusCode === 200;
    const parsedBody = JSON.parse(response.data.body);

    const normalizeRecommendations = (recommendations: any): RecommendationItem[] => {
      return recommendations.map((recommendation: any) => {
        return {
          title: recommendation.recommendation,
          priority: recommendation.confidence,
        };
      });
    };

    const normalizeError = (error: any): RecommendationError => {
      return {
        serviceName: initialConfig.name,
        errorCode: error.errorCode,
        errorMessage: error.errorMessage,
      };
    };

    return {
      isOk,
      data: isOk ? normalizeRecommendations(parsedBody) : undefined,
      error: !isOk ? normalizeError(parsedBody) : undefined,
    };
  },
};

const service2: ServiceConfiguration = {
  name: 'service2',
  endpoint: 'https://gozmvpzh6vaifsur2bjw4k7wcu0fgjsy.lambda-url.eu-central-1.on.aws/services/service2',
  mapInputToPayload: (input) => {
    const expectedHeightUnit = UNITS.FEET;
    const expectedWeightUnit = UNITS.POUND;

    return input.birthDate
      ? {
          measurements: {
            mass: convertWeight(input.weight, expectedWeightUnit),
            height: convertHeight(input.height, expectedHeightUnit),
          },
          birth_date: input.birthDate,
          session_token: '123456789',
        }
      : undefined;
  },
  mapResponse(response, initialConfig) {
    const isOk = response.data.statusCode === 200;
    const parsedBody = JSON.parse(response.data.body);

    const normalizeRecommendations = (recommendations: any): RecommendationItem[] => {
      return recommendations.map((recommendation: any) => {
        return {
          title: recommendation.title,
          priority: recommendation.priority / 1000,
          details: recommendation.details,
        };
      });
    };

    const normalizeError = (error: any): RecommendationError => {
      return {
        serviceName: initialConfig.name,
        errorCode: error.errorCode,
        errorMessage: error.errorMessage,
      };
    };

    return {
      isOk,
      data: isOk ? normalizeRecommendations(parsedBody) : undefined,
      error: !isOk ? normalizeError(parsedBody) : undefined,
    };
  },
  options: {
    retry: {
      retries: 0,
    },
  },
};
export const serviceConfigs: ServiceConfiguration[] = [service1, service2];
