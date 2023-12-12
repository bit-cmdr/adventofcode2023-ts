import * as fs from 'node:fs';

type Node = { [key: string]: [string, string] };

function parseLine(line: string): [string, string, string] {
  const [value, left, right] = line.match(/\w+/g)!.map((s) => s.trim());
  return [value, left, right];
}

function buildMap(lines: string[]): [string[], Node] {
  const traversal = lines[0].split('');

  const map: Node = {};
  for (let i = 2; i < lines.length; i++) {
    const [value, left, right] = parseLine(lines[i]);
    map[value] = [left, right];
  }

  return [traversal, map];
}

function traverse(map: Node, method: string[]): number {
  const entries = Object.keys(map).filter((k) => k.endsWith('A'));
  let step = 0;
  let visitor = 0;
  while (!entries.every((e) => e.endsWith('Z'))) {
    step++;
    for (let i = 0; i < entries.length; i++) {
      const [left, right] = map[entries[i]];
      entries[i] = method[visitor] === 'L' ? left : right;
    }
    visitor = visitor === method.length - 1 ? 0 : visitor + 1;
  }
  return step;
}

function puzzleInput(): string {
  return fs.readFileSync('src/day8/input.txt', 'utf8');
}

function main(): void {
  const lines = puzzleInput().split('\n');
  console.log('Lines: ', lines);

  const [traversal, map] = buildMap(lines);
  console.log('Traversal: ', traversal);
  console.log('Map: ', JSON.stringify(map, null, 2));

  const steps = traverse(map, traversal);
  console.log('Steps: ', steps);
}

main();
