import type { APIGatewayProxyEvent } from 'aws-lambda';
import { getRecommendations } from '../handler';

describe('getRecommendations function test', () => {
  it('should return expected APIGatewayProxyResult', async () => {
    const mockEvent = {
      body: JSON.stringify({
        height: {
          value: 6.036,
          unit: 'cm',
        },
        weight: {
          value: 234,
          unit: 'kg',
        },
        birthDate: '234234234',
      }),
    };

    const response = await getRecommendations(mockEvent as unknown as APIGatewayProxyEvent);

    expect(response.statusCode).toEqual(200);
  });
});
