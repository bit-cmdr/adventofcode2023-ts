import * as fs from 'node:fs';

type CategoryMap = {
  start: number;
  end: number;
};

type Category = {
  name: string;
  sources: CategoryMap[];
  destinations: CategoryMap[];
};

type Almanac = {
  seeds: CategoryMap[];
  categories: Category[];
};

type SeedMap = {
  seed: number;
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;
};

const knownCategories: string[] = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
];

function getDestination(lookup: CategoryMap, category: Category): CategoryMap {
  const n = { start: lookup.start, end: lookup.end };
  for (let i = 0; i < category.sources.length; i++) {
    for (let j = 0; j < category.sources.length; j++) {
      const source = category.sources[i];
      const curr = category.sources[j];

      if (i === j) {
        continue;
      }

      if (
        (source.start < curr.start && curr.start < source.end) ||
        (source.start < curr.end && curr.end < source.end)
      ) {
        n.start = Math.min(n.start, curr.start);
        n.end = Math.max(n.end, curr.end);
      }
    }
  }
  return n;
}

function mapSeed(seed: CategoryMap, categories: Category[]): number {
  const seedToSoil = categories.find((c) => c.name === 'seed-to-soil')!;
  const soilToFertilizer = categories.find(
    (c) => c.name === 'soil-to-fertilizer',
  )!;
  const fertilizerToWater = categories.find(
    (c) => c.name === 'fertilizer-to-water',
  )!;
  const waterToLight = categories.find((c) => c.name === 'water-to-light')!;
  const lightToTemperature = categories.find(
    (c) => c.name === 'light-to-temperature',
  )!;
  const temperatureToHumidity = categories.find(
    (c) => c.name === 'temperature-to-humidity',
  )!;
  const humidityToLocation = categories.find(
    (c) => c.name === 'humidity-to-location',
  )!;

  const soilR = getDestination(seed, seedToSoil);
  const fertilizerR = getDestination(soilR, soilToFertilizer);
  const waterR = getDestination(fertilizerR, fertilizerToWater);
  const lightR = getDestination(waterR, waterToLight);
  const temperatureR = getDestination(lightR, lightToTemperature);
  const humidityR = getDestination(temperatureR, temperatureToHumidity);
  const locationR = getDestination(humidityR, humidityToLocation);

  return locationR.start;
}

function buildAlmanac(lines: string[]): Almanac {
  const a: Almanac = {
    seeds: [],
    categories: [],
  };
  let currentCategory: Category | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === '') {
      continue;
    }

    if (line.includes('seeds:')) {
      const rawSeeds = line
        .split(':')[1]
        .split(' ')
        .map((s) => parseInt(s, 10))
        .filter((s) => !Number.isNaN(s));

      const seedPairs = rawSeeds.reduce<number[][]>((acc, seed, i) => {
        const j = Math.floor(i / 2);
        if (!acc[j]) {
          acc[j] = [];
        }

        acc[j].push(seed);
        return acc;
      }, []);
      for (let j = 0; j < seedPairs.length; j++) {
        const [start, range] = seedPairs[j];
        a.seeds.push({ start, end: start + range - 1 });
      }
      continue;
    }

    if (knownCategories.map((c) => `${c} map:`).includes(line)) {
      if (currentCategory !== null) {
        a.categories.push(currentCategory);
      }

      currentCategory = {
        name: line.substring(0, line.length - 5),
        sources: [],
        destinations: [],
      };
      continue;
    }

    if (!currentCategory) {
      continue;
    }

    const [ds, ss, rs] = line.split(' ');
    const source = parseInt(ss, 10);
    const destination = parseInt(ds, 10);
    const range = parseInt(rs, 10);

    currentCategory.sources.push({ start: source, end: source + range - 1 });
    currentCategory.destinations.push({
      start: destination,
      end: destination + range - 1,
    });

    if (i === lines.length - 1) {
      a.categories.push(currentCategory);
    }
  }

  return a;
}

function puzzleInput(): string {
  return fs.readFileSync('src/day5/input.txt', 'utf8');
}

function main(): void {
  const lines = puzzleInput()
    .split('\n')
    .filter((s) => s !== '');

  const almanac = buildAlmanac(lines);

  console.log('Almanac', JSON.stringify(almanac, null, 2));

  const mappedSeeds = almanac.seeds.map((s) => mapSeed(s, almanac.categories));

  console.log('Mapped seeds', mappedSeeds);

  console.log(
    'Lowest location',
    mappedSeeds.reduce((acc, curr) => Math.min(acc, curr), Infinity),
  );
}

main();
