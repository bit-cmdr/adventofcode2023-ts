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

const CUBE_LIMITS: CubeSet = {
  red: 12,
  green: 13,
  blue: 14,
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

  const validGames = games.filter((g) =>
    g.cubeSets.every(
      (cs) =>
        cs.red <= CUBE_LIMITS.red &&
        cs.green <= CUBE_LIMITS.green &&
        cs.blue <= CUBE_LIMITS.blue,
    ),
  );

  console.log('All games', JSON.stringify(games, null, 2));
  console.log('Valid games', validGames);
  console.log(
    'Valid game id total',
    validGames.reduce((acc, gt) => acc + gt.id, 0),
  );
}

main();
