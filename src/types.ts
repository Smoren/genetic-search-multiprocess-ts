import type { PhenotypeStrategyConfig } from "genetic-search";

/**
 * Configuration for the Multiprocessing Phenotype Strategy.
 *
 * @template TTaskConfig The type of phenotype task calculation configuration.
 *
 * @property {number} poolSize The size of the multiprocessing pool.
 *
 * @category Strategies Config
 */
export type MultiprocessingPhenotypeStrategyConfig<TTaskConfig> = PhenotypeStrategyConfig<TTaskConfig> & {
  poolSize: number;
};
