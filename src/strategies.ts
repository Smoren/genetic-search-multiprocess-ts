import { Pool } from 'multiprocess-pool';
import {
  BaseGenome,
  BaseMetricsStrategy,
  GenerationMetricsMatrix,
  GenomeMetricsRow,
} from "genetic-search";
import { MultiprocessingMetricsStrategyConfig } from "./types";

export abstract class BaseMultiprocessingMetricsStrategy<
  TGenome extends BaseGenome,
  TConfig extends MultiprocessingMetricsStrategyConfig<TTaskConfig>,
  TTaskConfig,
> extends BaseMetricsStrategy<TGenome, TConfig, TTaskConfig> {
  protected async execTasks(inputs: TTaskConfig[]): Promise<GenerationMetricsMatrix> {
    const pool = new Pool(this.config.poolSize);
    const result: GenerationMetricsMatrix = await pool.map(inputs, this.config.task, {
      onResult: (result: any, index: number) => this.config.onTaskResult?.(result as GenomeMetricsRow, inputs[index]),
    });
    pool.close();

    return result;
  }
}
