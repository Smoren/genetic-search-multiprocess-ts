import { Pool } from 'multiprocessor';
import {
  BaseGenome,
  BasePhenotypeStrategy,
  GenerationPhenotypeMatrix,
  GenomePhenotypeRow,
} from "genetic-search";
import { MultiprocessingPhenotypeStrategyConfig } from "./types";

/**
 * Base class for phenotype strategies that uses multiprocessing to execute phenotype calculation tasks.
 *
 * @template TGenome - The type of the genome.
 * @template TConfig - The type of the configuration for the phenotype strategy.
 * @template TTaskConfig - The type of the configuration for each phenotype calculation task.
 *
 * @category Strategies
 */
export abstract class BaseMultiprocessingPhenotypeStrategy<
  TGenome extends BaseGenome,
  TConfig extends MultiprocessingPhenotypeStrategyConfig<TTaskConfig>,
  TTaskConfig,
> extends BasePhenotypeStrategy<TGenome, TConfig, TTaskConfig> {
  /**
   * Execute the phenotype calculation tasks.
   *
   * @param inputs The inputs to the phenotype calculation tasks.
   * @returns A matrix of phenotype results, where each row corresponds to a single genome.
   */
  protected async execTasks(inputs: TTaskConfig[]): Promise<GenerationPhenotypeMatrix> {
    const pool = new Pool(this.config.poolSize);
    const result = await pool.map(
      inputs,
      this.config.task,
      (result, input) => this.config.onTaskResult?.(result as GenomePhenotypeRow, input),
    ) as GenerationPhenotypeMatrix;
    pool.close();

    return result;
  }
}
