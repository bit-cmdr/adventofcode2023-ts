import * as fs from 'node:fs';

function puzzleInput(): string {
  return fs.readFileSync('src/day5/input.txt', 'utf8');
}

function main(): void {
  const lines = puzzleInput()
    .split('\n')
    .filter((s) => s !== '');
}

main();
