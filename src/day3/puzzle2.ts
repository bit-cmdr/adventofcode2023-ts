import * as fs from 'node:fs';

type Match = {
  index: number;
  val: number;
};

const numRegex = /\d+/gm;
const symbolRegex = /\*/gm;

function puzzleInput(): string {
  return fs.readFileSync('src/day3/input.txt', 'utf8');
}

function adjacents(cells: string[][], row: number, col: number) {
  const width = cells[0].length;
  const height = cells.length;
  const rowMin = Math.max(row - 1, 0);
  const rowMax = Math.min(row + 1, height - 1);
  const colMin = Math.max(col - 1, 0);
  const colMax = Math.min(col + 1, width - 1);
  const strings: string[] = [];

  for (let i = rowMin; i <= rowMax; i++) {
    const cell = cells[i];
    for (let j = colMin; j <= colMax; j++) {
      if (j !== col || i !== row) {
        strings.push(cell[j]);
      }
    }
  }
  return strings;
}

function adjacentNumbers(cells: string[][], row: number, col: number): Match[] {
  const width = cells[0].length;
  const height = cells.length;
  const rowMin = Math.max(row - 1, 0);
  const rowMax = Math.min(row + 1, height - 1);
  const numbers: Match[] = [];

  for (let i = rowMin; i <= rowMax; i++) {
    const rowString = cells[i].join('');
    const nms: RegExpExecArray[] = [];
    let nm: RegExpExecArray | null;
    do {
      nm = numRegex.exec(rowString);
      if (nm) {
        nms.push(nm);
      }
    } while (nm);

    if (nms.length < 1) {
      continue;
    }

    const colMax = Math.min(col + 1, width - 1);
    for (let j = 0; j < nms.length; j++) {
      const colMin = Math.max(col - nms[j][0].length, 0);
      if (colMin <= nms[j].index && nms[j].index <= colMax) {
        numbers.push({ val: parseInt(nms[j][0], 10), index: nms[j].index });
      }
    }
  }
  return numbers;
}

function isPartNumber(strings: string[]): boolean {
  return strings.filter((s) => s.match(numRegex)).length >= 2;
}

function main(): void {
  const rows = puzzleInput()
    .split('\n')
    .filter((s) => s !== '');
  const cells = rows.map((row) => row.split(''));

  const ratios: Match[][] = [];
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      const cell = cells[i][j];
      if (cell.match(symbolRegex) && isPartNumber(adjacents(cells, i, j))) {
        const adjacentNums = adjacentNumbers(cells, i, j);
        console.log('evaluating row', i);
        if (ratios.length <= 0) {
          console.log('no ratios yet, creating');
          ratios.push([...adjacentNums]);
        } else if (ratios.length - 1 === i) {
          console.log('same row, appending', i, ratios.length - 1);
          ratios[i].push(...adjacentNums);
        } else {
          console.log('new row, creating', i, ratios.length - 1);
          try {
            ratios.push([
              ...adjacentNums.filter(
                (n) =>
                  !ratios[i - 1].some(
                    (r) => n.val === r.val && n.index === r.index,
                  ),
              ),
            ]);
          } catch (e) {
            console.log('index out of bounds', i, 'rows length', ratios.length);
            throw e;
          }
        }
      } else {
        ratios.push([]);
      }
      console.log('looping');
    }
  }

  const validRatios = ratios.filter((r) => r.length > 0 && r.length === 2);
  console.log('ratios:', validRatios);
  console.log(
    'Sum:',
    validRatios
      .reduce<number[]>((acc, r) => {
        acc.push(r.reduce((gr, g) => gr * g.val, 1));
        return acc;
      }, [])
      .reduce((acc, n) => acc + n, 0),
  );
}

main();
