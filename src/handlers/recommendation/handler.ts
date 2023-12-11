import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { validateRequestBody } from './validator';
import { getRecommendationsAndTips, RequestBody } from '../../services/recommendation';
import { formatResponseError } from '../../utils';
import { aggregateRecommendations } from './aggregator';

export const getRecommendations = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = await validateRequestBody(event.body);

    const recommendations = await getRecommendationsAndTips(body as RequestBody);

    const { data, errors } = aggregateRecommendations(recommendations);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
        errors,
      }),
    };
  } catch (error: any) {
    return formatResponseError(error);
  }
};
