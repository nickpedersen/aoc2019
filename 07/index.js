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
    [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0],
    43210,
    [4, 3, 2, 1, 0]
  ],
  [
    [
      3,
      23,
      3,
      24,
      1002,
      24,
      10,
      24,
      1002,
      23,
      -1,
      23,
      101,
      5,
      23,
      23,
      1,
      24,
      23,
      23,
      4,
      23,
      99,
      0,
      0
    ],
    54321,
    [0, 1, 2, 3, 4]
  ],
  [
    [
      3,
      31,
      3,
      32,
      1002,
      32,
      10,
      32,
      1001,
      31,
      -2,
      31,
      1007,
      31,
      0,
      33,
      1002,
      33,
      7,
      33,
      1,
      33,
      31,
      31,
      1,
      32,
      31,
      31,
      4,
      31,
      99,
      0,
      0,
      0,
      654
    ],
    65210,
    [1, 0, 4, 3, 2]
  ]
];

const intCode = (instructions, index = 0, inputValue, outputValue) => {
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

  // console.log(
  //   `Opcode: ${opCode}, parameter modes: ${parameterModes.join(
  //     ", "
  //   )}, parameters: ${parameters.join(", ")}`
  // );

  if (opCode === 1) {
    const replaceValue = parameters[0] + parameters[1];
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      replaceValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    // console.log(`Stored ${replaceValue} @ ${instructions[index + 3]}`);
    return intCode(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 2) {
    const replaceValue = parameters[0] * parameters[1];
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      replaceValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    // console.log(`Stored ${replaceValue} @ ${instructions[index + 3]}`);
    return intCode(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 3) {
    if (inputValue[0] === undefined) {
      // If we're waiting for an input value, we can suspend
      // a suspend is found by checking result.__suspended
      // A suspend can be resumed (with new inputs) by calling
      // result.next([newInputs]);
      return {
        outputValue,
        __suspended: true,
        next: nextInputs => {
          const newInstructions = [
            ...instructions.slice(0, instructions[index + 1]),
            nextInputs[0],
            ...instructions.slice(instructions[index + 1] + 1)
          ];
          return intCode(
            newInstructions,
            index + 2,
            nextInputs.slice(1),
            outputValue
          );
        }
      };
    }
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 1]),
      inputValue[0],
      ...instructions.slice(instructions[index + 1] + 1)
    ];
    // console.log(`Stored ${inputValue} @ ${instructions[index + 1]}`);
    return intCode(
      newInstructions,
      index + 2,
      inputValue.slice(1),
      outputValue
    );
  }
  if (opCode === 4) {
    const newOutputValue = parameters[0];
    // console.log(chalk.bold(`Outputted ${newOutputValue}`));
    return intCode(instructions, index + 2, inputValue, newOutputValue);
  }
  if (opCode === 5) {
    if (parameters[0] !== 0) {
      // console.log("Parameter is true, jumping");
      return intCode(instructions, parameters[1], inputValue, outputValue);
    } else {
      return intCode(instructions, index + 3, inputValue, outputValue);
    }
  }
  if (opCode === 6) {
    if (parameters[0] === 0) {
      // console.log("Parameter is false, jumping");
      return intCode(instructions, parameters[1], inputValue, outputValue);
    } else {
      return intCode(instructions, index + 3, inputValue, outputValue);
    }
  }
  if (opCode === 7) {
    const inputValue = parameters[0] < parameters[1] ? 1 : 0;
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      inputValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    // console.log(`Stored ${inputValue} @ ${instructions[index + 3]}`);
    return intCode(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 8) {
    const inputValue = parameters[0] === parameters[1] ? 1 : 0;
    const newInstructions = [
      ...instructions.slice(0, instructions[index + 3]),
      inputValue,
      ...instructions.slice(instructions[index + 3] + 1)
    ];
    // console.log(`Stored ${inputValue} @ ${instructions[index + 3]}`);
    return intCode(newInstructions, index + 4, inputValue, outputValue);
  }
  if (opCode === 99) {
    return outputValue;
  }
  // console.log(`Unknown opcode ${opCode}`);
};

const main = code => {
  let maxOutput = 0;
  let bestCombination = null;
  [0, 1, 2, 3, 4].forEach(ampAInput => {
    [0, 1, 2, 3, 4]
      .filter(i => ![ampAInput].includes(i))
      .forEach(ampBInput => {
        [0, 1, 2, 3, 4]
          .filter(i => ![ampAInput, ampBInput].includes(i))
          .forEach(ampCInput => {
            [0, 1, 2, 3, 4]
              .filter(i => ![ampAInput, ampBInput, ampCInput].includes(i))
              .forEach(ampDInput => {
                [0, 1, 2, 3, 4]
                  .filter(
                    i =>
                      ![ampAInput, ampBInput, ampCInput, ampDInput].includes(i)
                  )
                  .forEach(ampEInput => {
                    const outputA = intCode(code, 0, [ampAInput, 0]);
                    const outputB = intCode(code, 0, [ampBInput, outputA]);
                    const outputC = intCode(code, 0, [ampCInput, outputB]);
                    const outputD = intCode(code, 0, [ampDInput, outputC]);
                    const outputE = intCode(code, 0, [ampEInput, outputD]);
                    if (outputE > maxOutput) {
                      maxOutput = outputE;
                      bestCombination = [
                        ampAInput,
                        ampBInput,
                        ampCInput,
                        ampDInput,
                        ampEInput
                      ];
                    }
                  });
              });
          });
      });
  });
  return [maxOutput, bestCombination];
};

console.log(chalk.blue("** Running test cases **"));
testCases.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main(input);
  console.log(`Output: ${answer[0]}`);
  console.log(`Expected: ${output}`);
  if (answer[0] !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const [result] = main(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const testCases2 = [
  [
    [
      3,
      26,
      1001,
      26,
      -4,
      26,
      3,
      27,
      1002,
      27,
      2,
      27,
      1,
      27,
      26,
      27,
      4,
      27,
      1001,
      28,
      -1,
      28,
      1005,
      28,
      6,
      99,
      0,
      0,
      5
    ],
    139629729
  ],
  [
    [
      3,
      52,
      1001,
      52,
      -5,
      52,
      3,
      53,
      1,
      52,
      56,
      54,
      1007,
      54,
      5,
      55,
      1005,
      55,
      26,
      1001,
      54,
      -5,
      54,
      1105,
      1,
      12,
      1,
      53,
      54,
      53,
      1008,
      54,
      0,
      55,
      1001,
      55,
      1,
      55,
      2,
      53,
      55,
      53,
      4,
      53,
      1001,
      56,
      -1,
      56,
      1005,
      56,
      6,
      99,
      0,
      0,
      0,
      0,
      10
    ],
    18216
  ]
];

const main2 = code => {
  let maxOutput = 0;
  let bestCombination = null;
  [5, 6, 7, 8, 9].forEach(ampAInput => {
    [5, 6, 7, 8, 9]
      .filter(i => ![ampAInput].includes(i))
      .forEach(ampBInput => {
        [5, 6, 7, 8, 9]
          .filter(i => ![ampAInput, ampBInput].includes(i))
          .forEach(ampCInput => {
            [5, 6, 7, 8, 9]
              .filter(i => ![ampAInput, ampBInput, ampCInput].includes(i))
              .forEach(ampDInput => {
                [5, 6, 7, 8, 9]
                  .filter(
                    i =>
                      ![ampAInput, ampBInput, ampCInput, ampDInput].includes(i)
                  )
                  .forEach(ampEInput => {
                    let inLoop = true;
                    let inputA = 0;
                    // Store our suspendable machines in an array
                    const machines = [];
                    machines.push(intCode(code, 0, [ampAInput, inputA]));
                    machines.push(
                      intCode(code, 0, [ampBInput, machines[0].outputValue])
                    );
                    machines.push(
                      intCode(code, 0, [ampCInput, machines[1].outputValue])
                    );
                    machines.push(
                      intCode(code, 0, [ampDInput, machines[2].outputValue])
                    );
                    machines.push(
                      intCode(code, 0, [ampEInput, machines[3].outputValue])
                    );

                    while (inLoop) {
                      machines.forEach((machine, ix) => {
                        const machineInput = machines[ix === 0 ? 4 : ix - 1];

                        machines[ix] = machine.next([
                          machineInput.__suspended
                            ? machineInput.outputValue
                            : machineInput
                        ]);
                      });
                      if (!machines[4].__suspended) {
                        inLoop = false;
                        if (machines[4] > maxOutput) {
                          maxOutput = machines[4];
                          bestCombination = [
                            ampAInput,
                            ampBInput,
                            ampCInput,
                            ampDInput,
                            ampEInput
                          ];
                        }
                      }
                    }
                  });
              });
          });
      });
  });
  return [maxOutput, bestCombination];
};

console.log(chalk.blue("** Running test cases **"));
testCases2.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main2(input);
  console.log(`Output: ${answer[0]}`);
  console.log(`Expected: ${output}`);
  if (answer[0] !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const [result2] = main2(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result2}`));
