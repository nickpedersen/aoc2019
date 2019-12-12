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
                    const machineA = new IntCode(code);
                    machineA.addInputs([ampAInput, 0]);
                    const outputA = machineA.run();

                    const machineB = new IntCode(code);
                    machineB.addInputs([ampBInput, outputA]);
                    const outputB = machineB.run();

                    const machineC = new IntCode(code);
                    machineC.addInputs([ampCInput, outputB]);
                    const outputC = machineC.run();

                    const machineD = new IntCode(code);
                    machineD.addInputs([ampDInput, outputC]);
                    const outputD = machineD.run();

                    const machineE = new IntCode(code);
                    machineE.addInputs([ampEInput, outputD]);
                    const outputE = machineE.run();

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
                    machines.push(new IntCode(code));
                    machines[0].addInputs([ampAInput, inputA]);
                    machines[0].run();

                    machines.push(new IntCode(code));
                    machines[1].addInputs([
                      ampBInput,
                      machines[0].getMostRecentOutput()
                    ]);
                    machines[1].run();

                    machines.push(new IntCode(code));
                    machines[2].addInputs([
                      ampCInput,
                      machines[1].getMostRecentOutput()
                    ]);
                    machines[2].run();

                    machines.push(new IntCode(code));
                    machines[3].addInputs([
                      ampDInput,
                      machines[2].getMostRecentOutput()
                    ]);
                    machines[3].run();

                    machines.push(new IntCode(code));
                    machines[4].addInputs([
                      ampEInput,
                      machines[3].getMostRecentOutput()
                    ]);
                    machines[4].run();

                    while (inLoop) {
                      let returnValue = null;
                      machines.forEach((machine, ix) => {
                        const machineInput = machines[ix === 0 ? 4 : ix - 1];

                        machine.addInputs([machineInput.getMostRecentOutput()]);
                        returnValue = machine.run();
                      });
                      if (returnValue) {
                        inLoop = false;
                        if (returnValue > maxOutput) {
                          maxOutput = returnValue;
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
