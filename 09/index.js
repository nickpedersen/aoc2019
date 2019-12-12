const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));
const IntCode = require("../intCode");

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [
    [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99],
    (answer, intCode) =>
      JSON.stringify(intCode.output) ===
      JSON.stringify([
        109,
        1,
        204,
        -1,
        1001,
        100,
        1,
        100,
        1008,
        100,
        16,
        101,
        1006,
        101,
        0,
        99
      ])
  ],
  [
    [1102, 34915192, 34915192, 7, 4, 7, 99, 0],
    answer => String(answer).length === 16
  ],
  [[104, 1125899906842624, 99], 1125899906842624]
];

const main = (code, inputs = []) => {
  const intCode = new IntCode(code);
  intCode.addInputs(inputs);
  return [intCode.run(), intCode];
};

console.log(chalk.blue("** Running test cases **"));
testCases.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const [answer, intCode] = main(input);
  console.log(`Output: ${answer}`);
  if (typeof output === "function") {
    if (!output(answer, intCode)) {
      throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
    }
  } else {
    console.log(`Expected: ${output}`);
    if (answer !== output) {
      throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
    }
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const [result, intCode] = main(puzzleInput, [1]);
console.log(intCode.output[0]);
console.log(chalk.bgMagenta(`Result: ${intCode.output[0]}`));

console.log(chalk.yellow("** Part 2 **"));

console.log(chalk.blue("** Calculating **"));

const [result2, intCode2] = main(puzzleInput, [2]);
console.log(intCode2.output[0]);
console.log(chalk.bgMagenta(`Result: ${intCode2.output[0]}`));
