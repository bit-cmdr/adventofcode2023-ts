import * as fs from 'node:fs';

type Match = {
  index: number;
  val: string;
};

const numRegex = /\d+/gm;
const symbolRegex =
  /\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\-|\+|\=|\{|\[|\}|\]|\||\\|\:|\;|\"|\'|\<|\,|\>|\?|\//gm;

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
    const currentRow = cells[i];
    for (let j = colMin; j <= colMax; j++) {
      if (j !== col || i !== row) {
        strings.push(currentRow[j]);
      }
    }
  }
  return strings;
}

function isPartNumber(strings: string[]): boolean {
  return strings.some((s) => s.match(symbolRegex));
}

function main(): void {
  const rows = puzzleInput()
    .split('\n')
    .filter((s) => s !== '');
  const cells = rows.map((row) => row.split(''));

  const validNums: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    let number = '';
    let validated = false;
    for (let j = 0; j < cells[i].length; j++) {
      const cell = cells[i][j];
      if (cell.match(numRegex)) {
        number += cell;
        validated = validated || isPartNumber(adjacents(cells, i, j));
        if (j === cells[i].length - 1) {
          if (validated) {
            validNums.push(parseInt(number));
            validated = false;
          }
          number = '';
        }
      } else {
        if (validated) {
          validNums.push(parseInt(number));
          validated = false;
        }
        number = '';
      }
    }
  }

  console.log('Valid nums:', validNums);
  console.log(
    'Sum:',
    validNums.reduce((acc, n) => acc + n, 0),
  );
}

main();
