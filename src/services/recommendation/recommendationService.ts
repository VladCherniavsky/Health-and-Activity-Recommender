import { httpClient } from '../httpClient';
import { serviceConfigs } from './downstreamServiceConfig';
import {
  RequestBody,
  GetRecommendationsAndTipsItem,
  ServiceConfiguration,
  ServiceConfigurationWithPayload,
} from './types';

const getValidatePayloadPredicate =
  (body: RequestBody) =>
  (acc: ServiceConfigurationWithPayload, service: ServiceConfiguration): ServiceConfigurationWithPayload => {
    const payload = service.mapInputToPayload(body);

    return payload ? [...acc, { ...service, payload }] : acc;
  };

const getResponsesMapPredicate =
  (initialRequestsConfig: ServiceConfigurationWithPayload) => (response: any, index: number) => {
    const config = initialRequestsConfig[index];
    const { mapResponse } = config;
    return mapResponse(response, config);
  };

export const getRecommendationsAndTips = async (body: RequestBody): Promise<GetRecommendationsAndTipsItem[]> => {
  const configsWithValidPayload = serviceConfigs.reduce(getValidatePayloadPredicate(body), []);

  const requests = configsWithValidPayload.map((service) => {
    return httpClient
      .post(service.endpoint, service.payload, service.options)
      .then((response) => response)
      .catch((response) => response);
  });

  const responses = await Promise.all(requests);

  return responses.map(getResponsesMapPredicate(configsWithValidPayload));
};
