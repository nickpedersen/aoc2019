const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .map(i => Number(i));

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [12, 2],
  [14, 2],
  [1969, 654],
  [100756, 33583]
];

const main = input => {
  return Math.max(Math.floor(input / 3) - 2, 0);
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

const result = puzzleInput.reduce((prev, curr) => prev + main(curr), 0);
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const testCases2 = [
  [14, 2],
  [1969, 966],
  [100756, 50346]
];

const recursiveMain = input => {
  const result = Math.max(Math.floor(input / 3) - 2, 0);
  if (result !== 0) {
    return result + recursiveMain(result);
  }
  return result;
};

console.log(chalk.blue("** Running test cases **"));
testCases2.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = recursiveMain(input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

const result2 = puzzleInput.reduce(
  (prev, curr) => prev + recursiveMain(curr),
  0
);
console.log(chalk.bgMagenta(`Result: ${result2}`));
