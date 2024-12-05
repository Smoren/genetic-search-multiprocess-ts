import type { MetricsStrategyConfig } from "genetic-search";

export type MultiprocessingMetricsStrategyConfig<TTaskConfig> = MetricsStrategyConfig<TTaskConfig> & {
  poolSize: number;
}
