const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("")
  .map(i => Number(i));

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [["123456789012".split("").map(Number), 3, 2], 1] // Layer 2, 1x1 = 1
];

const main = ([input, width, height]) => {
  const layerSize = width * height;
  const splitIntoLayers = (collection, remaining) => {
    return remaining.length > layerSize
      ? splitIntoLayers(
          [...collection, remaining.slice(0, layerSize)],
          remaining.slice(layerSize)
        )
      : [...collection, remaining];
  };
  const inputAsLayers = splitIntoLayers([], input);
  const layerWithLeastZeroes =
    inputAsLayers[
      inputAsLayers.reduce(
        (prev, curr, ix) => {
          const zeroes = curr.filter(i => i === 0).length;
          if (zeroes < prev.minZeroes || prev.minZeroes === -1)
            return { ix, minZeroes: zeroes };
          return prev;
        },
        { ix: -1, minZeroes: -1 }
      ).ix
    ];

  const ones = layerWithLeastZeroes.filter(i => i === 1).length;
  const twos = layerWithLeastZeroes.filter(i => i === 2).length;
  return ones * twos;
};

console.log(chalk.blue("** Running test cases **"));
testCases.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main(input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result = main([puzzleInput, 25, 6]);
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const testCases2 = [
  [["0222112222120000".split("").map(Number), 2, 2], `01\n10`]
];

const main2 = ([input, width, height]) => {
  const layerSize = width * height;
  const splitIntoLayers = (collection, remaining) => {
    return remaining.length > layerSize
      ? splitIntoLayers(
          [...collection, remaining.slice(0, layerSize)],
          remaining.slice(layerSize)
        )
      : [...collection, remaining];
  };
  const inputAsLayers = splitIntoLayers([], input);

  const image = [...new Array(height)].map(i =>
    [...new Array(width)].map(i => 2)
  );

  inputAsLayers.forEach(layer => {
    layer.forEach((pixel, ix) => {
      const x = ix % width;
      const y = Math.floor(ix / width);
      const currentValue = image[y][x];
      if (currentValue === 2) {
        image[y][x] = pixel;
      }
    });
  });
  const imageRender = image.map(i => i.join("")).join("\n");
  console.log(
    image
      .map(i =>
        i.map(p => (p === 1 ? chalk.bgBlack(" ") : chalk.bgWhite(" "))).join("")
      )
      .join("\n")
  );
  return imageRender;
};

console.log(chalk.blue("** Running test cases **"));
testCases2.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main2(input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result2 = main2([puzzleInput, 25, 6]);
console.log(chalk.bgMagenta(`Result: ${result2}`));
