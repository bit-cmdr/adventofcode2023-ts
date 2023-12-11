import * as fs from 'node:fs';
import { type } from 'node:os';

const deck = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

type Hand = {
  cards: number[];
  bid: number;
  score: number;
};

function parseHands(lines: string[]): Hand[] {
  return lines
    .map((line) => line.split(' '))
    .map(([cards, bid]) => ({
      cards: cards.split('').map((c) => deck.indexOf(c)),
      bid: parseInt(bid, 10),
      score: tally(cards),
    }));
}

function tally(cards: string): number {
  const total: { [card: string]: number } = {};
  for (const card of cards.split('')) {
    total[card] = (total[card] ?? 0) + 1;
  }
  const [primary = 0, secondary = 0] = Object.values(total).sort(
    (a, b) => b - a,
  );
  return primary * 3 + secondary;
}

function rankHands(left: Hand, right: Hand): number {
  if (left.score !== right.score) {
    return left.score - right.score;
  }
  let i = 0;
  while (true) {
    if (left.cards[i] !== right.cards[i]) {
      return left.cards[i] - right.cards[i];
    }
    i++;
  }
}

function puzzleInput(): string {
  return fs.readFileSync('src/day7/input.txt', 'utf8');
}

function main(): void {
  const lines = puzzleInput().split('\n');
  console.log('Lines: ', lines);

  const hands = parseHands(lines);
  console.log('Hands: ', hands);

  const ranked = hands.sort(rankHands);
  console.log('Ranked: ', ranked);

  console.log(
    'Final: ',
    ranked.map((h, i) => h.bid * (i + 1)).reduce((a, b) => a + b, 0),
  );
}

main();
