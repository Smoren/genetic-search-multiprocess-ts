import { describe, expect, it } from "@jest/globals";
import {
  AveragePhenomeCache,
  ComposedGeneticSearch,
  ComposedGeneticSearchConfig,
  GeneticSearch,
  GeneticSearchConfig,
  GeneticSearchStrategyConfig,
  DummyPhenomeCache,
  SimplePhenomeCache,
  DescendingSortingStrategy,
  RandomSelectionStrategy,
  TournamentSelectionStrategy,
} from "genetic-search";
import {
  calcPathDistance,
  getPermutations,
  TravelingCrossoverStrategy,
  TravelingFitnessStrategy,
  TravelingGenome,
  TravelingMultiprocessingPhenomeStrategy,
  TravelingMutationStrategy,
  TravelingPopulateStrategy,
  // @ts-ignore
} from "./fixtures";
// @ts-ignore
import { dataProviderForTravelingSalesman } from "./data";

describe.each([
  ...dataProviderForTravelingSalesman(),
] as Array<[number[][]]>)(
  'Traveling Salesman Multiprocessing Test',
  (distanceMatrix: number[][]) => {
    it('', () => {
      const config: GeneticSearchConfig = {
        populationSize: 30,
        survivalRate: 0.5,
        crossoverRate: 0.5,
      };

      const strategies: GeneticSearchStrategyConfig<TravelingGenome> = {
        populate: new TravelingPopulateStrategy(distanceMatrix.length),
        phenome: new TravelingMultiprocessingPhenomeStrategy({
          poolSize: 4,
          distanceMatrix,
          task: (data) => {
            const [path, distanceMatrix] = data;
            let totalDistance = 0;

            for (let i = 0; i < path.length; i++) {
              const from = path[i];
              const to = path[(i + 1) % path.length];
              totalDistance += distanceMatrix[from][to];
            }

            return Promise.resolve([1 / totalDistance]);
          },
        }),
        fitness: new TravelingFitnessStrategy(),
        sorting: new DescendingSortingStrategy(),
        selection: new TournamentSelectionStrategy<TravelingGenome>(2, 5),
        mutation: new TravelingMutationStrategy(),
        crossover: new TravelingCrossoverStrategy(),
        cache: new DummyPhenomeCache(),
      }

      const search = new GeneticSearch<TravelingGenome>(config, strategies);
      return search.fit({ generationsCount: 30 }).then(() => {
        const bestGenome = search.bestGenome;

        const expectedMinDistance = getPermutations(distanceMatrix.length)
          .map((path) => calcPathDistance(path, distanceMatrix))
          .sort((a, b) => a - b)[0];

        expect(calcPathDistance(bestGenome.path, distanceMatrix)).toBeCloseTo(expectedMinDistance);
      });
    }, 10000);
  },
);

describe.each([
  ...dataProviderForTravelingSalesman(),
] as Array<[number[][]]>)(
  'Traveling Salesman Cached Multiprocessing Test',
  (distanceMatrix: number[][]) => {
    it('', () => {
      const config: GeneticSearchConfig = {
        populationSize: 30,
        survivalRate: 0.5,
        crossoverRate: 0.5,
      };

      const strategies: GeneticSearchStrategyConfig<TravelingGenome> = {
        populate: new TravelingPopulateStrategy(distanceMatrix.length),
        phenome: new TravelingMultiprocessingPhenomeStrategy({
          poolSize: 4,
          distanceMatrix,
          task: (data) => {
            const [path, distanceMatrix] = data;
            let totalDistance = 0;

            for (let i = 0; i < path.length; i++) {
              const from = path[i];
              const to = path[(i + 1) % path.length];
              totalDistance += distanceMatrix[from][to];
            }

            return Promise.resolve([1 / totalDistance]);
          },
        }),
        fitness: new TravelingFitnessStrategy(),
        sorting: new DescendingSortingStrategy(),
        mutation: new TravelingMutationStrategy(),
        selection: new RandomSelectionStrategy<TravelingGenome>(2),
        crossover: new TravelingCrossoverStrategy(),
        cache: new SimplePhenomeCache(),
      }

      const search = new GeneticSearch<TravelingGenome>(config, strategies);
      return search.fit({ generationsCount: 30 }).then(() => {
        const bestGenome = search.bestGenome;

        const expectedMinDistance = getPermutations(distanceMatrix.length)
          .map((path) => calcPathDistance(path, distanceMatrix))
          .sort((a, b) => a - b)[0];

        expect(calcPathDistance(bestGenome.path, distanceMatrix)).toBeCloseTo(expectedMinDistance);
      });
    }, 10000);
  },
);

describe.each([
  ...dataProviderForTravelingSalesman(),
] as Array<[number[][]]>)(
  'Traveling Salesman Composed Multiprocessing Test',
  (distanceMatrix: number[][]) => {
    it('', () => {
      const config: ComposedGeneticSearchConfig = {
        eliminators: {
          populationSize: 10,
          survivalRate: 0.5,
          crossoverRate: 0.5,
        },
        final: {
          populationSize: 2,
          survivalRate: 0.5,
          crossoverRate: 0.5,
        }
      };

      const strategies: GeneticSearchStrategyConfig<TravelingGenome> = {
        populate: new TravelingPopulateStrategy(distanceMatrix.length),
        phenome: new TravelingMultiprocessingPhenomeStrategy({
          poolSize: 4,
          distanceMatrix,
          task: (data) => {
            const [path, distanceMatrix] = data;
            let totalDistance = 0;

            for (let i = 0; i < path.length; i++) {
              const from = path[i];
              const to = path[(i + 1) % path.length];
              totalDistance += distanceMatrix[from][to];
            }

            return Promise.resolve([1 / totalDistance]);
          },
        }),
        fitness: new TravelingFitnessStrategy(),
        sorting: new DescendingSortingStrategy(),
        selection: new TournamentSelectionStrategy<TravelingGenome>(2, 5),
        mutation: new TravelingMutationStrategy(),
        crossover: new TravelingCrossoverStrategy(),
        cache: new DummyPhenomeCache(),
      }

      const search = new ComposedGeneticSearch<TravelingGenome>(config, strategies);
      return search.fit({ generationsCount: 30 }).then(() => {
        const bestGenome = search.bestGenome;

        const expectedMinDistance = getPermutations(distanceMatrix.length)
          .map((path) => calcPathDistance(path, distanceMatrix))
          .sort((a, b) => a - b)[0];

        expect(calcPathDistance(bestGenome.path, distanceMatrix)).toBeCloseTo(expectedMinDistance);
      });
    }, 50000);
  }
);

describe.each([
  ...dataProviderForTravelingSalesman(),
] as Array<[number[][]]>)(
  'Traveling Salesman Cached Composed Multiprocessing Test',
  (distanceMatrix: number[][]) => {
    it('', () => {
      const config: ComposedGeneticSearchConfig = {
        eliminators: {
          populationSize: 10,
          survivalRate: 0.5,
          crossoverRate: 0.5,
        },
        final: {
          populationSize: 2,
          survivalRate: 0.5,
          crossoverRate: 0.5,
        }
      };

      const strategies: GeneticSearchStrategyConfig<TravelingGenome> = {
        populate: new TravelingPopulateStrategy(distanceMatrix.length),
        phenome: new TravelingMultiprocessingPhenomeStrategy({
          poolSize: 4,
          distanceMatrix,
          task: (data) => {
            const [path, distanceMatrix] = data;
            let totalDistance = 0;

            for (let i = 0; i < path.length; i++) {
              const from = path[i];
              const to = path[(i + 1) % path.length];
              totalDistance += distanceMatrix[from][to];
            }

            return Promise.resolve([1 / totalDistance]);
          },
        }),
        fitness: new TravelingFitnessStrategy(),
        sorting: new DescendingSortingStrategy(),
        mutation: new TravelingMutationStrategy(),
        selection: new RandomSelectionStrategy<TravelingGenome>(2),
        crossover: new TravelingCrossoverStrategy(),
        cache: new AveragePhenomeCache(),
      }

      const search = new ComposedGeneticSearch<TravelingGenome>(config, strategies);
      return search.fit({ generationsCount: 30 }).then(() => {
        const bestGenome = search.bestGenome;

        const expectedMinDistance = getPermutations(distanceMatrix.length)
          .map((path) => calcPathDistance(path, distanceMatrix))
          .sort((a, b) => a - b)[0];

        expect(calcPathDistance(bestGenome.path, distanceMatrix)).toBeCloseTo(expectedMinDistance);
      });
    }, 50000);
  }
);
