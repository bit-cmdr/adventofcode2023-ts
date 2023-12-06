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
  seeds: number[];
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

function getDestination(lookup: number, category: Category): number {
  for (let i = 0; i < category.sources.length; i++) {
    const source = category.sources[i];
    if (source.start <= lookup && lookup <= source.end) {
      const destination = category.destinations[i];
      return destination.start + lookup - source.start;
    }
  }
  return lookup;
}

function mapSeed(seed: number, categories: Category[]): SeedMap {
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

  const soil = getDestination(seed, seedToSoil);
  const fertilizer = getDestination(soil, soilToFertilizer);
  const water = getDestination(fertilizer, fertilizerToWater);
  const light = getDestination(water, waterToLight);
  const temperature = getDestination(light, lightToTemperature);
  const humidity = getDestination(temperature, temperatureToHumidity);
  const location = getDestination(humidity, humidityToLocation);

  return {
    seed,
    soil,
    fertilizer,
    water,
    light,
    temperature,
    humidity,
    location,
  };
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
      a.seeds = line
        .split(':')[1]
        .split(' ')
        .map((s) => parseInt(s, 10))
        .filter((s) => !Number.isNaN(s));
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

  console.log('Mapped seeds', JSON.stringify(mappedSeeds, null, 2));

  console.log(
    'Lowest location',
    Math.min(...mappedSeeds.map((s) => s.location)),
  );
}

main();
