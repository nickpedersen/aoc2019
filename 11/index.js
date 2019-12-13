const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));
const IntCode = require("../intCode");

console.log(chalk.yellow("** Part 1 **"));

const main = (code, startingColor) => {
  const canvas = [...new Array(120)].map(() =>
    [...new Array(120)].map(() => -1)
  );
  const intCode = new IntCode(code);

  let x = 60;
  let y = 60;
  let direction = 0; // 0 is up, 1 is right, 2 is down, 3 is left

  if (startingColor) {
    canvas[y][x] = startingColor;
  }

  while (!intCode.completed) {
    const input = [canvas[y][x] === 1 ? 1 : 0];

    intCode.addInputs(input);
    intCode.run();
    const color = intCode.output[intCode.output.length - 2];
    const turn = intCode.output[intCode.output.length - 1];

    canvas[y][x] = color;

    direction = ((turn ? direction + 1 : direction - 1) + 4) % 4;
    if (direction === 0) {
      y -= 1;
    } else if (direction === 1) {
      x += 1;
    } else if (direction === 2) {
      y += 1;
    } else if (direction === 3) {
      x -= 1;
    } else {
      throw new Error("unknown direction!");
    }
  }
  return canvas;
};

console.log(chalk.blue("** Calculating **"));

const canvas = main(puzzleInput);

const allPanels = canvas.reduce((prev, curr) => [...prev, ...curr], []);
const result = allPanels.filter(p => p !== -1).length;
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

console.log(chalk.blue("** Calculating **"));

const canvas2 = main(puzzleInput, 1);
console.log(
  canvas2
    .filter(i => i.filter(p => p === 1).length)
    .map(i =>
      i.map(p => (p === 1 ? chalk.bgWhite(" ") : chalk.bgBlack(" "))).join("")
    )
    .join("\n")
);
