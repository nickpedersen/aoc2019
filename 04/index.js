const chalk = require("chalk");

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [111111, true],
  [223450, false],
  [123789, false]
];

const main = input => {
  // Check digit length
  if (String(input).length !== 6) return false;

  // Look for adjacent digits
  const digits = String(input).split("");
  const hasAdjacentDigits = digits.reduce((prev, curr, ix) => {
    if (ix === 0) return prev;
    if (digits[ix - 1] === curr) return true;
    return prev;
  }, false);
  if (!hasAdjacentDigits) return false;

  // Check digits always increase
  const alwaysIncreases = digits.reduce((prev, curr, ix) => {
    if (ix === 0) return prev;
    if (Number(digits[ix - 1]) > curr) return false;
    return prev;
  }, true);
  if (!alwaysIncreases) return false;
  return true;
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

const input = [...new Array(657474 - 183564 + 1)].map((i, ix) => 183564 + ix);

const result = input.reduce((prev, curr) => {
  const passes = main(curr);
  if (passes) return prev + 1;
  return prev;
}, 0);

console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 1 **"));

const testCases2 = [
  [112233, true],
  [123444, false],
  [111122, true]
];

const main2 = input => {
  // Check digit length
  if (String(input).length !== 6) return false;

  // Look for adjacent digits
  const digits = String(input).split("");
  const hasAdjacentDigits = digits.reduce((prev, curr, ix) => {
    if (ix === 0) return prev;
    if (
      digits[ix - 2] !== curr &&
      digits[ix - 1] === curr &&
      digits[ix + 1] !== curr
    )
      return true;
    return prev;
  }, false);
  if (!hasAdjacentDigits) return false;

  // Check digits always increase
  const alwaysIncreases = digits.reduce((prev, curr, ix) => {
    if (ix === 0) return prev;
    if (Number(digits[ix - 1]) > curr) return false;
    return prev;
  }, true);
  if (!alwaysIncreases) return false;
  return true;
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

const result2 = input.reduce((prev, curr) => {
  const passes = main2(curr);
  if (passes) return prev + 1;
  return prev;
}, 0);

console.log(chalk.bgMagenta(`Result: ${result2}`));
