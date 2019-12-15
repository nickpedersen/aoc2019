const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));
const IntCode = require("../intCode");

console.log(chalk.yellow("** Part 1 **"));

const main = code => {
  const intCode = new IntCode(code);
  intCode.run();
  const splitIntoChunks = (collection, remaining) => {
    const chunkSize = 3;
    return remaining.length > chunkSize
      ? splitIntoChunks(
          [...collection, remaining.slice(0, chunkSize)],
          remaining.slice(chunkSize) || []
        )
      : [...collection, remaining];
  };
  const tiles = splitIntoChunks([], intCode.output);
  const blockTiles = tiles.filter(i => i[2] === 2);
  return blockTiles.length;
};

console.log(chalk.blue("** Calculating **"));

const result = main(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

console.log(chalk.blue("** Calculating **"));

const main2 = async code => {
  code[0] = 2; // Insert quarters
  const canvas = [];
  let score = 0;
  let ball = [];
  let paddle = [];
  const intCode = new IntCode(code);
  intCode.run();
  const splitIntoChunks = (collection, remaining) => {
    const chunkSize = 3;
    return remaining.length > chunkSize
      ? splitIntoChunks(
          [...collection, remaining.slice(0, chunkSize)],
          remaining.slice(chunkSize) || []
        )
      : [...collection, remaining];
  };

  while (!intCode.completed) {
    const tiles = splitIntoChunks([], intCode.output);

    tiles.forEach(tile => {
      const [x, y, val] = tile;
      if (x === -1 && y === 0) score = val;
      if (!canvas[y]) canvas[y] = [];
      canvas[y][x] = val;
    });

    console.clear();
    console.log(`SCORE: ${score}`);
    canvas.forEach(row => {
      console.log(
        row
          .map(v => {
            if (v === 0) return chalk.bgBlack("  ");
            if (v === 1) return chalk.bgWhite("  ");
            if (v === 2) return chalk.bgBlue("  ");
            if (v === 3) return chalk.bgYellow("  ");
            if (v === 4) return chalk.bgRed("  ");
          })
          .join("")
      );
    });

    if (!intCode.running) {
      // Move the paddle
      ball = tiles.find(t => t[2] === 4) || ball;
      paddle = tiles.find(t => t[2] === 3) || paddle;

      if (ball[0] < paddle[0]) {
        intCode.addInputs([-1]);
      } else if (ball[0] > paddle[0]) {
        intCode.addInputs([1]);
      } else {
        intCode.addInputs([0]);
      }

      await new Promise(p => setTimeout(p, 1));
      intCode.clearOuput();
      intCode.run();
    }
  }
};

const result2 = main2(puzzleInput);

console.log(chalk.bgMagenta(`Result: ${result2}`));
