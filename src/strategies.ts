import { Pool } from 'multiprocessor';
import {
  BaseGenome,
  BasePhenomeStrategy,
  GenerationPhenomeMatrix,
  PhenomeRow,
} from "genetic-search";
import { MultiprocessingPhenomeStrategyConfig } from "./types";

/**
 * Base class for phenome strategies that uses multiprocessing to execute phenome calculation tasks.
 *
 * @template TGenome - The type of the genome.
 * @template TConfig - The type of the configuration for the phenome strategy.
 * @template TTaskConfig - The type of the configuration for each phenome calculation task.
 *
 * @category Strategies
 */
export abstract class BaseMultiprocessingPhenomeStrategy<
  TGenome extends BaseGenome,
  TConfig extends MultiprocessingPhenomeStrategyConfig<TTaskConfig>,
  TTaskConfig,
> extends BasePhenomeStrategy<TGenome, TConfig, TTaskConfig> {
  /**
   * Execute the phenome calculation tasks.
   *
   * @param inputs The inputs to the phenome calculation tasks.
   * @returns A matrix of phenome results, where each row corresponds to a single genome.
   */
  protected async execTasks(inputs: TTaskConfig[]): Promise<GenerationPhenomeMatrix> {
    const pool = new Pool(this.config.poolSize);
    const result = await pool.map(
      inputs,
      this.config.task,
      { onTaskSuccess: (result, input) => this.config.onTaskResult?.(result as PhenomeRow, input) },
    ) as GenerationPhenomeMatrix;
    pool.close();

    return result;
  }
}
