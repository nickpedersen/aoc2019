const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split(",")
  .map(i => Number(i));

console.log(chalk.yellow("** Part 1 **"));

const main = (instructions, index = 0, inputValue, outputValue) => {
  const instruction = instructions[index + 0];
  const opCode = instruction % 100;
  const parameterModes = String(Math.floor(instruction / 100))
    .padStart(3, "0")
    .split("")
    .map(Number);

  const parameters = [];
  parameters[0] = parameterModes[2]
    ? instructions[index + 1]
    : instructions[instructions[index + 1]];
  parameters[1] = parameterModes[1]
    ? instructions[index + 2]
    : instructions[instructions[index + 2]];
  parameters[2] = parameterModes[1]
    ? instructions[index + 3]
    : instructions[instructions[index + 3]];

  // console.log(instructions);

  console.log(
    `Opcode: ${opCode}, parameter modes: ${parameterModes.join(
      ", "
    )}, parameters: ${parameters.join(", ")}`
  );

  if (opCode === 1) {
    const replaceValue = parameters[0] + parameters[1];
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      replaceValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    console.log(`Stored ${replaceValue} @ ${instructions[index + 3]}`);
    return main(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 2) {
    const replaceValue = parameters[0] * parameters[1];
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      replaceValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    console.log(`Stored ${replaceValue} @ ${instructions[index + 3]}`);
    return main(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 3) {
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 1]),
      inputValue,
      ...instructions.slice(instructions[index + 1] + 1)
    ];
    console.log(`Stored ${inputValue} @ ${instructions[index + 1]}`);
    return main(newInstructions, index + 2, inputValue, outputValue);
  }
  if (opCode === 4) {
    const newOutputValue = parameters[0];
    console.log(chalk.bold(`Outputted ${newOutputValue}`));
    return main(instructions, index + 2, inputValue, newOutputValue);
  }
  if (opCode === 5) {
    if (parameters[0] !== 0) {
      console.log("Parameter is true, jumping");
      return main(instructions, parameters[1], inputValue, outputValue);
    } else {
      return main(instructions, index + 3, inputValue, outputValue);
    }
  }
  if (opCode === 6) {
    if (parameters[0] === 0) {
      console.log("Parameter is false, jumping");
      return main(instructions, parameters[1], inputValue, outputValue);
    } else {
      return main(instructions, index + 3, inputValue, outputValue);
    }
  }
  if (opCode === 7) {
    const inputValue = parameters[0] < parameters[1] ? 1 : 0;
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      inputValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    console.log(`Stored ${inputValue} @ ${instructions[index + 3]}`);
    return main(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 8) {
    const inputValue = parameters[0] === parameters[1] ? 1 : 0;
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      inputValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    console.log(`Stored ${inputValue} @ ${instructions[index + 3]}`);
    return main(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 99) {
    return outputValue;
  }
  console.log(`Unknown opcode ${opCode}`);
};

console.log(chalk.blue("** Calculating **"));

const result = main(puzzleInput, 0, 1);

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
  const answer = main(instructions, 0, input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result2 = main(puzzleInput, 0, 5);

console.log(chalk.bgMagenta(`Result: ${result2}`));
