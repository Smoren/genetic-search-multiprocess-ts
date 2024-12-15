import type { MetricsStrategyConfig } from "genetic-search";

/**
 * Configuration for the Multiprocessing Metrics Strategy.
 *
 * @template TTaskConfig The type of metrics task calculation configuration.
 *
 * @property {number} poolSize The size of the multiprocessing pool.
 */
export type MultiprocessingMetricsStrategyConfig<TTaskConfig> = MetricsStrategyConfig<TTaskConfig> & {
  poolSize: number;
};
