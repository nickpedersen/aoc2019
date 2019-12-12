const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));
const IntCode = require("../intCode");

console.log(chalk.yellow("** Part 1 **"));

const main = (code, input) => {
  const intCode = new IntCode(code);
  intCode.addInputs([input]);
  return intCode.run();
};

console.log(chalk.blue("** Calculating **"));

const result = main(puzzleInput, 1);

console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const testCases2 = [
  [[3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8, 1],
  [[3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 9, 0],
  [[3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 7, 0],
  [[3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 7, 1],
  [[3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 9, 0],
  [[3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 8, 0],
  [[3, 3, 1108, -1, 8, 3, 4, 3, 99], 8, 1],
  [[3, 3, 1108, -1, 8, 3, 4, 3, 99], 9, 0],
  [[3, 3, 1108, -1, 8, 3, 4, 3, 99], 7, 0],
  [[3, 3, 1107, -1, 8, 3, 4, 3, 99], 7, 1],
  [[3, 3, 1107, -1, 8, 3, 4, 3, 99], 9, 0],
  [[3, 3, 1107, -1, 8, 3, 4, 3, 99], 8, 0],
  [[3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 0, 0],
  [[3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 1, 1],
  [[3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 932, 1],
  [[3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 0, 0],
  [[3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 1, 1],
  [[3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 932, 1],
  [
    [
      3,
      21,
      1008,
      21,
      8,
      20,
      1005,
      20,
      22,
      107,
      8,
      21,
      20,
      1006,
      20,
      31,
      1106,
      0,
      36,
      98,
      0,
      0,
      1002,
      21,
      125,
      20,
      4,
      20,
      1105,
      1,
      46,
      104,
      999,
      1105,
      1,
      46,
      1101,
      1000,
      1,
      20,
      4,
      20,
      1105,
      1,
      46,
      98,
      99
    ],
    7,
    999
  ],
  [
    [
      3,
      21,
      1008,
      21,
      8,
      20,
      1005,
      20,
      22,
      107,
      8,
      21,
      20,
      1006,
      20,
      31,
      1106,
      0,
      36,
      98,
      0,
      0,
      1002,
      21,
      125,
      20,
      4,
      20,
      1105,
      1,
      46,
      104,
      999,
      1105,
      1,
      46,
      1101,
      1000,
      1,
      20,
      4,
      20,
      1105,
      1,
      46,
      98,
      99
    ],
    8,
    1000
  ],
  [
    [
      3,
      21,
      1008,
      21,
      8,
      20,
      1005,
      20,
      22,
      107,
      8,
      21,
      20,
      1006,
      20,
      31,
      1106,
      0,
      36,
      98,
      0,
      0,
      1002,
      21,
      125,
      20,
      4,
      20,
      1105,
      1,
      46,
      104,
      999,
      1105,
      1,
      46,
      1101,
      1000,
      1,
      20,
      4,
      20,
      1105,
      1,
      46,
      98,
      99
    ],
    9,
    1001
  ]
];

console.log(chalk.blue("** Running test cases **"));
testCases2.forEach(([instructions, input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${instructions}. Input value: ${input}`);
  const answer = main(instructions, input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result2 = main(puzzleInput, 5);

console.log(chalk.bgMagenta(`Result: ${result2}`));
