import { RecommendationItem, RecommendationError } from '../../services/recommendation';

export type AggregatedResult = {
  data: RecommendationItem[];
  errors: RecommendationError[];
};
