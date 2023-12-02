import * as fs from 'node:fs';

type CubeSet = {
  red: number;
  green: number;
  blue: number;
};

type Game = {
  id: number;
  cubeSets: CubeSet[];
};

const gameRegex = /Game (\d+):\s/g;
const colorRegex = /(\d+)\s(red|green|blue)/g;
const numRegex = /\d+/g;

function puzzleInput(): string {
  return fs.readFileSync('src/day2/input.txt', 'utf8');
}

function toCubeSet(str: string): CubeSet {
  const matches = str.match(colorRegex);
  return {
    red: parseInt(
      matches?.find((m) => m.includes('red'))?.match(numRegex)?.[0] ?? '0',
      10,
    ),
    green: parseInt(
      matches?.find((m) => m.includes('green'))?.match(numRegex)?.[0] ?? '0',
      10,
    ),
    blue: parseInt(
      matches?.find((m) => m.includes('blue'))?.match(numRegex)?.[0] ?? '0',
      10,
    ),
  };
}

function toGame(str: string): Game {
  const matches = str.match(gameRegex);
  if (!matches || matches.length < 1) {
    throw new Error(`Could not parse game from ${str}`);
  }

  return {
    id: parseInt(matches[0].match(numRegex)?.[0] ?? '0', 10),
    cubeSets: str
      .split(matches[0])[1]
      .split(';')
      .map(toCubeSet),
  };
}

function main(): void {
  const games = puzzleInput()
    .split('\n')
    .filter((s) => s !== '')
    .map(toGame);

  const gameMinimumCubeSets = games.map((g) => ({
    id: g.id,
    cubeSet: g.cubeSets.reduce<CubeSet>(
      (acc, cs) => ({
        red: acc.red > cs.red ? acc.red : cs.red,
        green: acc.green > cs.green ? acc.green : cs.green,
        blue: acc.blue > cs.blue ? acc.blue : cs.blue,
      }),
      { red: 0, green: 0, blue: 0 },
    ),
  }));

  const gamePowers = gameMinimumCubeSets.map((g) => ({
    id: g.id,
    power: g.cubeSet.red * g.cubeSet.green * g.cubeSet.blue,
  }));

  console.log('All games', games);
  console.log('Game minimum cube sets', gameMinimumCubeSets);
  console.log('Game powers', gamePowers);
  console.log(
    'Sum powers',
    gamePowers.reduce((acc, gt) => acc + gt.power, 0),
  );
}

main();
