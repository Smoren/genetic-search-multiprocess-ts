import {
  BaseGenome,
  GenerationPhenomeMatrix,
  CrossoverStrategyInterface,
  GenerationFitnessColumn,
  PopulateStrategyInterface,
  FitnessStrategyInterface,
  BaseMutationStrategy,
  BaseMutationStrategyConfig,
  IdGeneratorInterface,
} from "genetic-search";
import type { MultiprocessingPhenomeStrategyConfig } from "../../src";
import { BaseMultiprocessingPhenomeStrategy } from "../../src";

export type ParabolaArgumentGenome = BaseGenome & {
  id: number;
  x: number;
}

export type ParabolaTaskConfig = [number];

function createRandomParabolaArgument(id: number): ParabolaArgumentGenome {
  return { id, x: Math.random() * 200 - 100 };
}

export class ParabolaPopulateStrategy implements PopulateStrategyInterface<ParabolaArgumentGenome> {
  populate(size: number, idGenerator: IdGeneratorInterface<ParabolaArgumentGenome>): ParabolaArgumentGenome[] {
    const result: ParabolaArgumentGenome[] = [];
    for (let i=0; i<size; ++i) {
      result.push(createRandomParabolaArgument(idGenerator.nextId()));
    }
    return result;
  }
}

export class ParabolaMutationStrategy extends BaseMutationStrategy<ParabolaArgumentGenome, BaseMutationStrategyConfig> {
  constructor() {
    super({ probability: 1 });
  }

  mutate(genome: ParabolaArgumentGenome, newGenomeId: number): ParabolaArgumentGenome {
    return { x: genome.x + Math.random() * 10 - 5, id: newGenomeId };
  }
}

export class ParabolaCrossoverStrategy implements CrossoverStrategyInterface<ParabolaArgumentGenome> {
  cross(parents: ParabolaArgumentGenome[], newGenomeId: number): ParabolaArgumentGenome {
    const [lhs, rhs] = parents;
    return { x: (lhs.x + rhs.x) / 2, id: newGenomeId };
  }
}

export class ParabolaMultiprocessingPhenomeStrategy extends BaseMultiprocessingPhenomeStrategy<ParabolaArgumentGenome, MultiprocessingPhenomeStrategyConfig<ParabolaTaskConfig>, ParabolaTaskConfig> {
  protected createTaskInput(genome: ParabolaArgumentGenome): ParabolaTaskConfig {
    return [genome.x];
  }
}

export class ParabolaMaxValueFitnessStrategy implements FitnessStrategyInterface {
  score(results: GenerationPhenomeMatrix): GenerationFitnessColumn {
    return results.map((result) => result[0]);
  }
}
