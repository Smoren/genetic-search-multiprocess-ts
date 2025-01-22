import type { PhenomeStrategyConfig } from "genetic-search";

/**
 * Configuration for the Multiprocessing Phenome Strategy.
 *
 * @template TTaskConfig The type of phenome task calculation configuration.
 *
 * @property {number} poolSize The size of the multiprocessing pool.
 *
 * @category Strategies Config
 */
export type MultiprocessingPhenomeStrategyConfig<TTaskConfig> = PhenomeStrategyConfig<TTaskConfig> & {
  poolSize: number;
};
