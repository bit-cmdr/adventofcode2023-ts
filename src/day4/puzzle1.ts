import * as fs from 'node:fs';

function puzzleInput(): string {
  return fs.readFileSync('src/day4/input.txt', 'utf8');
}

type Card = {
  id: number;
  winningNumbers: number[];
  playedNumbers: number[];
  wins: number;
};

function parseCard(card: string): Card {
  const [gameId, numbers] = card.split(':');
  const [winning, played] = numbers.split('|');
  const winningNumbers = winning
    .split(' ')
    .filter((w) => w !== '')
    .map((n) => parseInt(n, 10));

  const playedNumbers = played
    .split(' ')
    .filter((p) => p !== '')
    .map((n) => parseInt(n, 10));

  return {
    id: parseInt(gameId.match(/\d+/)![0], 10),
    winningNumbers,
    playedNumbers,
    wins: playedNumbers.filter((n) => winningNumbers.includes(n)).length,
  };
}

function main(): void {
  const cardRows = puzzleInput()
    .split('\n')
    .filter((s) => s !== '');

  const cards = cardRows.map(parseCard);

  console.log('Cards', cards);

  const score = cards
    .map((c) => (c.wins > 0 ? 2 ** (c.wins - 1) : 0))
    .reduce((acc, curr) => acc + curr, 0);
  console.log('Score', score);
}

main();
