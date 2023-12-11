import { GetRecommendationsAndTipsItem } from '../../services/recommendation';
import { AggregatedResult } from './types';

export const aggregateRecommendations = (recommendationData: GetRecommendationsAndTipsItem[]): AggregatedResult => {
  const aggregatePredicate = (
    acc: AggregatedResult,
    recommendationItem: GetRecommendationsAndTipsItem,
  ): AggregatedResult => {
    return {
      ...acc,
      data:
        recommendationItem.isOk && recommendationItem.data?.length
          ? [...acc.data, ...recommendationItem.data]
          : acc.data,
      errors:
        !recommendationItem.isOk && recommendationItem.error ? [...acc.errors, recommendationItem.error] : acc.errors,
    };
  };

  return recommendationData.reduce(aggregatePredicate, { data: [], errors: [] });
};
