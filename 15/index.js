const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));
const IntCode = require("../intCode");

console.log(chalk.yellow("** Part 1 **"));

const main = (code, getWholeMaze = false) => {
  const canvas = [...new Array(100)].map(() =>
    [...new Array(100)].map(() => -1)
  );
  let intCode = new IntCode(code);

  let x = 50;
  let y = 50;

  let stop = false;
  const choicePoints = [];
  let steps = 0;
  while (!stop) {
    const immediateDirections = {
      1: canvas[y - 1][x] === -1,
      2: canvas[y + 1][x] === -1,
      3: canvas[y][x - 1] === -1,
      4: canvas[y][x + 1] === -1
    };

    let viableMoves = Object.entries(immediateDirections)
      .filter(([dir, viable]) => viable)
      .map(([dir]) => Number(dir));

    if (!viableMoves.length) {
      const lastMove = choicePoints.pop();
      if (lastMove) {
        steps = lastMove.steps;
        viableMoves = lastMove.options;
        x = lastMove.x;
        y = lastMove.y;
        intCode = lastMove.intCode;
      } else if (getWholeMaze) {
        stop = true;
      }
    }

    const move = viableMoves[Math.floor(Math.random() * viableMoves.length)];

    if (viableMoves.length > 1) {
      choicePoints.push({
        x,
        y,
        options: viableMoves.filter(m => m !== move),
        steps,
        intCode: intCode.clone()
      });
    }

    intCode.addInputs([move]);
    intCode.run();

    const response = intCode.getMostRecentOutput();

    if (response === 2 && !getWholeMaze) stop = true;

    if (move === 1) {
      canvas[y - 1][x] = response;
      if (response !== 0) {
        y -= 1;
        steps++;
      }
    } else if (move === 2) {
      canvas[y + 1][x] = response;
      if (response !== 0) {
        y += 1;
        steps++;
      }
    } else if (move === 3) {
      canvas[y][x - 1] = response;
      if (response !== 0) {
        x -= 1;
        steps++;
      }
    } else if (move === 4) {
      canvas[y][x + 1] = response;
      if (response !== 0) {
        x += 1;
        steps++;
      }
    }

    if (steps % 100 === 0 || stop) {
      console.clear();
      console.log(
        canvas
          .map((l, _y) =>
            l
              .map((i, _x) => {
                if (_y === y && _x === x) {
                  return chalk.bgRed(" ");
                }
                if (i === 2) return chalk.bgBlue(" ");
                if (i === 1) return chalk.bgWhite(" ");
                if (i === 0) return chalk.bgGrey(" ");
                if (i === -1) return chalk.bgBlack(" ");
              })
              .join("")
          )
          .join("\n")
      );
    }
  }

  return getWholeMaze ? canvas : steps;
};

console.log(chalk.blue("** Calculating **"));

const result = main(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const main2 = code => {
  const canvas = main(code, true);

  let step = 0;
  let stop = false;

  while (!stop) {
    // If there are no more white spaces left
    const flatGrid = canvas.reduce((prev, curr, y) => [
      ...prev,
      ...curr.map((i, x) => ({ x, y, val: i }))
    ]);
    if (flatGrid.filter(i => i.val === 1).length === 0) {
      stop = true;
    } else {
      step += 1;
      flatGrid
        .filter(i => i.val === 2)
        .forEach(i => {
          // Find all adjacent places that are empty and fill them with oxygen
          if (canvas[i.y - 1][i.x] === 1) {
            canvas[i.y - 1][i.x] = 2;
          }
          if (canvas[i.y + 1][i.x] === 1) {
            canvas[i.y + 1][i.x] = 2;
          }
          if (canvas[i.y][i.x - 1] === 1) {
            canvas[i.y][i.x - 1] = 2;
          }
          if (canvas[i.y][i.x + 1] === 1) {
            canvas[i.y][i.x + 1] = 2;
          }
        });
    }

    console.clear();
    console.log(
      canvas
        .map((l, _y) =>
          l
            .map((i, _x) => {
              if (i === 2) return chalk.bgBlue(" ");
              if (i === 1) return chalk.bgWhite(" ");
              if (i === 0) return chalk.bgGrey(" ");
              if (i === -1) return chalk.bgBlack(" ");
            })
            .join("")
        )
        .join("\n")
    );
  }
  return step;
};

console.log(chalk.blue("** Calculating **"));

const result2 = main2(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result2}`));
