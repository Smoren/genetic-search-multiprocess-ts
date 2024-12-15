import { Pool } from 'multiprocess-pool';
import {
  BaseGenome,
  BaseMetricsStrategy,
  GenerationMetricsMatrix,
  GenomeMetricsRow,
} from "genetic-search";
import { MultiprocessingMetricsStrategyConfig } from "./types";

/**
 * Base class for metrics strategies that uses multiprocessing to execute metrics calculation tasks.
 *
 * @template TGenome - The type of the genome.
 * @template TConfig - The type of the configuration for the metrics strategy.
 * @template TTaskConfig - The type of the configuration for each metrics calculation task.
 */
export abstract class BaseMultiprocessingMetricsStrategy<
  TGenome extends BaseGenome,
  TConfig extends MultiprocessingMetricsStrategyConfig<TTaskConfig>,
  TTaskConfig,
> extends BaseMetricsStrategy<TGenome, TConfig, TTaskConfig> {
  /**
   * Execute the metrics calculation tasks.
   *
   * @param inputs The inputs to the metrics calculation tasks.
   * @returns A matrix of metrics results, where each row corresponds to a single genome.
   */
  protected async execTasks(inputs: TTaskConfig[]): Promise<GenerationMetricsMatrix> {
    const pool = new Pool(this.config.poolSize);
    const result: GenerationMetricsMatrix = await pool.map(inputs, this.config.task, {
      onResult: (result: any, index: number) => this.config.onTaskResult?.(result as GenomeMetricsRow, inputs[index]),
    });
    pool.close();

    return result;
  }
}
