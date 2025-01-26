import { describe, expect, it } from "@jest/globals";
import {
  ComposedGeneticSearch,
  ComposedGeneticSearchConfig,
  GeneticSearch,
  GeneticSearchConfig,
  GeneticSearchStrategyConfig,
  IdGenerator,
  DummyPhenomeCache,
  SimplePhenomeCache,
  DescendingSortingStrategy,
  RandomSelectionStrategy,
} from "genetic-search";
import {
  ParabolaArgumentGenome,
  ParabolaCrossoverStrategy,
  ParabolaMultiprocessingPhenomeStrategy,
  ParabolaMutationStrategy,
  ParabolaPopulateStrategy,
  ParabolaTaskConfig,
  ParabolaMaxValueFitnessStrategy,
  // @ts-ignore
} from "./fixtures";

describe('Parabola Multiprocessing', () => {
  it('Get Parabola Max Multiprocessing Test', () => {
    const [a, b] = [12, -3];
    const [x, y] = [-12, -3];

    const config: GeneticSearchConfig = {
      populationSize: 100,
      survivalRate: 0.5,
      crossoverRate: 0.5,
    };

    const strategies: GeneticSearchStrategyConfig<ParabolaArgumentGenome> = {
      populate: new ParabolaPopulateStrategy(),
      phenome: new ParabolaMultiprocessingPhenomeStrategy({
        poolSize: 4,
        task: (x: ParabolaTaskConfig) => Promise.resolve([-((x[0]+12)**2) - 3]),
        onTaskResult: () => void 0,
      }),
      fitness: new ParabolaMaxValueFitnessStrategy(),
      sorting: new DescendingSortingStrategy(),
      selection: new RandomSelectionStrategy<ParabolaArgumentGenome>(2),
      mutation: new ParabolaMutationStrategy(),
      crossover: new ParabolaCrossoverStrategy(),
      cache: new DummyPhenomeCache(),
    }

    const search = new GeneticSearch<ParabolaArgumentGenome>(config, strategies);

    return search.fit({
      generationsCount: 100,
      beforeStep: () => void 0,
      afterStep: () => void 0,
    }).then(() => {
      const bestGenome = search.bestGenome;

      expect(bestGenome.x).toBeCloseTo(x);
      expect(-((bestGenome.x+a)**2) + b).toBeCloseTo(y);

      const population = search.population;
      expect(population.length).toBe(100);

      search.setPopulation(population, true);
      expect(search.population).toEqual(population);
    });
  }, 50000);

  it('Get Parabola Max Cached Multiprocessing Test', () => {
    const [a, b] = [12, -3];
    const [x, y] = [-12, -3];

    const config: GeneticSearchConfig = {
      populationSize: 100,
      survivalRate: 0.5,
      crossoverRate: 0.5,
    };

    const strategies: GeneticSearchStrategyConfig<ParabolaArgumentGenome> = {
      populate: new ParabolaPopulateStrategy(),
      phenome: new ParabolaMultiprocessingPhenomeStrategy({
        poolSize: 4,
        task: (x: ParabolaTaskConfig) => Promise.resolve([-((x[0]+12)**2) - 3]),
      }),
      fitness: new ParabolaMaxValueFitnessStrategy(),
      sorting: new DescendingSortingStrategy(),
      selection: new RandomSelectionStrategy<ParabolaArgumentGenome>(2),
      mutation: new ParabolaMutationStrategy(),
      crossover: new ParabolaCrossoverStrategy(),
      cache: new SimplePhenomeCache(),
    }

    const search = new GeneticSearch<ParabolaArgumentGenome>(config, strategies);

    return search.fit({
      afterStep: () => void 0,
      stopCondition: (scores) => Math.abs(scores[0] - y) < 10e-7,
    }).then(() => {
      const bestGenome = search.bestGenome;

      expect(bestGenome.x).toBeCloseTo(x);
      expect(-((bestGenome.x+a)**2) + b).toBeCloseTo(y);

      const population = search.population;
      expect(population.length).toBe(100);

      search.setPopulation(population, false);
      expect(search.population).toEqual(population);
    });
  }, 50000);

  it('Get Parabola Max Composed Multiprocessing Test', () => {
    const [a, b] = [12, -3];
    const [x, y] = [-12, -3];

    const config: ComposedGeneticSearchConfig = {
      eliminators: {
        populationSize: 10,
        survivalRate: 0.5,
        crossoverRate: 0.5,
      },
      final: {
        populationSize: 10,
        survivalRate: 0.5,
        crossoverRate: 0.5,
      }
    };

    const strategies: GeneticSearchStrategyConfig<ParabolaArgumentGenome> = {
      populate: new ParabolaPopulateStrategy(),
      phenome: new ParabolaMultiprocessingPhenomeStrategy({
        poolSize: 4,
        task: (data: ParabolaTaskConfig) => Promise.resolve([-((data[0]+12)**2) - 3]),
      }),
      fitness: new ParabolaMaxValueFitnessStrategy(),
      sorting: new DescendingSortingStrategy(),
      selection: new RandomSelectionStrategy<ParabolaArgumentGenome>(2),
      mutation: new ParabolaMutationStrategy(),
      crossover: new ParabolaCrossoverStrategy(),
      cache: new DummyPhenomeCache(),
    }

    const search = new ComposedGeneticSearch<ParabolaArgumentGenome>(config, strategies);

    return search.fit({
      afterStep: () => void 0,
      stopCondition: (scores) => Math.abs(scores[0] - y) < 10e-7,
    }).then(() => {
      const bestGenome = search.bestGenome;

      expect(bestGenome.x).toBeCloseTo(x);
      expect(-((bestGenome.x+a)**2) + b).toBeCloseTo(y);

      const population = search.population;
      expect(population.length).toBe(110);

      search.setPopulation(population, false);
      expect(search.population).toEqual(population);
    });
  }, 50000);

  it('Get Parabola Max Composed Cached Multiprocessing Test', () => {
    const [a, b] = [12, -3];
    const [x, y] = [-12, -3];

    const config: ComposedGeneticSearchConfig = {
      eliminators: {
        populationSize: 10,
        survivalRate: 0.5,
        crossoverRate: 0.5,
      },
      final: {
        populationSize: 10,
        survivalRate: 0.5,
        crossoverRate: 0.5,
      }
    };

    const strategies: GeneticSearchStrategyConfig<ParabolaArgumentGenome> = {
      populate: new ParabolaPopulateStrategy(),
      phenome: new ParabolaMultiprocessingPhenomeStrategy({
        poolSize: 4,
        task: (data: ParabolaTaskConfig) => Promise.resolve([-((data[0]+12)**2) - 3]),
      }),
      fitness: new ParabolaMaxValueFitnessStrategy(),
      sorting: new DescendingSortingStrategy(),
      selection: new RandomSelectionStrategy<ParabolaArgumentGenome>(2),
      mutation: new ParabolaMutationStrategy(),
      crossover: new ParabolaCrossoverStrategy(),
      cache: new SimplePhenomeCache(),
    }

    const search = new ComposedGeneticSearch<ParabolaArgumentGenome>(config, strategies, new IdGenerator());

    return search.fit({
      afterStep: () => void 0,
      stopCondition: (scores) => Math.abs(scores[0] - y) < 10e-7,
    }).then(() => {
      const bestGenome = search.bestGenome;

      expect(bestGenome.x).toBeCloseTo(x);
      expect(-((bestGenome.x+a)**2) + b).toBeCloseTo(y);

      const population = search.population;
      expect(population.length).toBe(110);

      search.setPopulation(population, false);
      expect(search.population).toEqual(population);
    });
  }, 50000);
});
