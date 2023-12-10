import * as fs from 'node:fs';

type Race = {
  time: number;
  distance: number;
};

type WinStats = {
  heldFor: number;
  distance: number;
  totalRaceTime: number;
};

function winStats(race: Race): WinStats[] {
  const wins: WinStats[] = [];
  for (let i = race.time; i > 0; i--) {
    const holdTime = race.time - i;
    const distance = holdTime * i;
    // console.log(
    //   'Race time ',
    //   race.time,
    //   ' with distance to beat ',
    //   race.distance,
    //   ' held for ',
    //   race.time,
    //   '-',
    //   i,
    //   '=',
    //   holdTime,
    //   ' traveled distance ',
    //   holdTime,
    //   '*',
    //   i,
    //   '=',
    //   distance,
    // );
    if (distance > race.distance) {
      wins.push({
        distance,
        heldFor: holdTime,
        totalRaceTime: race.time,
      });
    }
  }

  return wins;
}

function getNumber(line: string): number {
  return parseInt(line.match(/\d+/g)?.reduce((acc, n) => acc + n) ?? '0', 10);
}

function buildScoreboard(lines: string[]): Race {
  const timingLine = lines[0];
  const distanceLine = lines[1];
  const timing = getNumber(timingLine);
  const distance = getNumber(distanceLine);
  return {
    time: timing,
    distance,
  };
}

function puzzleInput(): string {
  return fs.readFileSync('src/day6/input.txt', 'utf8');
}

function main(): void {
  const lines = puzzleInput().split('\n');
  console.log('Lines: ', lines);

  const scoreboard = buildScoreboard(lines);
  console.log('Scoreboard: ', scoreboard);

  const betterWinStats = winStats(scoreboard);
  // console.log('Better Win Stats: ', JSON.stringify(betterWinStats, null, 2));

  console.log('Margin of error: ', betterWinStats.length);
}

main();
