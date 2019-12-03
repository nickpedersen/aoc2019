const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [
    [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50],
    [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]
  ],
  [
    [1, 0, 0, 0, 99],
    [2, 0, 0, 0, 99]
  ],
  [
    [2, 3, 0, 3, 99],
    [2, 3, 0, 6, 99]
  ],
  [
    [2, 4, 4, 5, 99, 0],
    [2, 4, 4, 5, 99, 9801]
  ],
  [
    [1, 1, 1, 4, 99, 5, 6, 0, 99],
    [30, 1, 1, 4, 2, 5, 6, 0, 99]
  ]
];

const main = (input, start = 0) => {
  const opCode = input[start + 0];
  const firstIndex = input[start + 1];
  const secondIndex = input[start + 2];
  const outputIndex = input[start + 3];
  if (opCode === 1) {
    console.log("Opcode 1, adding");
    const replaceValue = input[firstIndex] + input[secondIndex];
    const newInput = [
      ...input.slice(0, outputIndex),
      replaceValue,
      ...input.slice(outputIndex + 1)
    ];
    return main(newInput, start + 4);
  }
  if (opCode === 2) {
    console.log("Opcode 2, multiplying");
    const replaceValue = input[firstIndex] * input[secondIndex];
    const newInput = [
      ...input.slice(0, outputIndex),
      replaceValue,
      ...input.slice(outputIndex + 1)
    ];
    return main(newInput, start + 4);
  }
  if (opCode === 99) {
    console.log("Opcode 99, completing");
    return input;
  }
  console.log(`Unknown opcode ${opCode}`);
};

console.log(chalk.blue("** Running test cases **"));
testCases.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main(input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (JSON.stringify(answer) !== JSON.stringify(output)) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

puzzleInput[1] = 12;
puzzleInput[2] = 2;
const result = main(puzzleInput);

console.log(chalk.bgMagenta(`Result: ${result}`));
console.log(chalk.bgMagenta(`Answer: ${result[0]}`));

console.log(chalk.yellow("** Part 2 **"));

const nouns = [...new Array(100)].map((i, ix) => ix);
const verbs = [...new Array(100)].map((i, ix) => ix);
let hasFoundAnswer = false;

console.log(nouns);

nouns.forEach(noun => {
  if (hasFoundAnswer) return;
  verbs.forEach(verb => {
    if (hasFoundAnswer) return;
    console.log(`Trying ${noun}, ${verb}`);
    puzzleInput[1] = noun;
    puzzleInput[2] = verb;

    const result = main(puzzleInput);
    if (result[0] === 19690720) {
      console.log(chalk.bgMagenta(`Result: ${noun}, ${verb}`));
      console.log(chalk.bgMagenta(`Answer: ${100 * noun + verb}`));
      hasFoundAnswer = true;
    }
  });
});
