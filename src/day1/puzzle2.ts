import * as fs from 'node:fs';

const numWords = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

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
  const nums = numWords
    .reduce(
      (acc, nw, i) =>
        acc.includes(nw)
          ? acc.replaceAll(
              nw,
              `${nw.substring(0, 1)}${i + 1}${nw.substring(2)}`,
            )
          : acc,
      str,
    )
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
