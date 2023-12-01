import * as fs from 'node:fs';

function puzzleInput(): string {
  return fs.readFileSync('src/day1/input.txt', 'utf8');
}

function toInt(str: string): number | undefined {
  const n = parseInt(str, 10);
  if (Number.isNaN(n)) {
    return undefined;
  }

  return n;
}

function twoDigitNumber(str: string): number {
  const nums = str
    .split('')
    .map(toInt)
    .filter((num) => num !== undefined);

  if (nums.length === 1) {
    return parseInt(`${nums[0]}${nums[0]}`, 10);
  }

  return parseInt(`${nums[0]}${nums[nums.length - 1]}`, 10);
}

function main(): void {
  const numbers = puzzleInput().split('\n').map(twoDigitNumber);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  console.log('All numbers', numbers);
  console.log('Sum', sum);
}

main();
