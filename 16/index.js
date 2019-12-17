const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("")
  .map(Number);

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  ["12345678".split("").map(Number), 4, "01029498".split("").map(Number)],
  [
    "80871224585914546619083218645595".split("").map(Number),
    100,
    "24176176".split("").map(Number)
  ],
  [
    "19617804207202209144916044189917".split("").map(Number),
    100,
    "73745418".split("").map(Number)
  ],
  [
    "69317163492948606335995924319873".split("").map(Number),
    100,
    "52432133".split("").map(Number)
  ]
];

const main = (input, phases = 100, returnFull) => {
  const basePattern = [0, 1, 0, -1];
  let signal = input;

  let phase = 1;
  while (phase <= phases) {
    console.log("Phase:", phase);
    signal = signal.map((i, ix) => {
      const pattern = basePattern.reduce((prev, curr) => {
        prev.push(...[...new Array(ix + 1)].map(_ => curr));
        return prev;
      }, []);
      return Math.abs(
        signal.reduce(
          (prev, curr, ix) => prev + pattern[(ix + 1) % pattern.length] * curr,
          0
        ) % 10
      );
    });
    phase++;
  }

  if (returnFull) return signal;

  return signal.slice(0, 8);
};

console.log(chalk.blue("** Running test cases **"));
testCases.forEach(([input, phases, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input} Phases: ${phases}`);
  const answer = main(input, phases);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (JSON.stringify(answer) !== JSON.stringify(output)) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result = main(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result.join("")}`));

console.log(chalk.yellow("** Part 2 **"));

const main2 = input => {
  const repeatedInput = [];
  [...new Array(10000)].forEach(i => repeatedInput.push(...input));
  // It seems the last number is always unchanged by 100 phases
  // The second last is itself + last (mod 10)
  // This implies: start at the end
  // -> add the next digit (or nothing if we're at the end)
  // -> Move back one digit
  // -> Repeat

  // We can find the index without iternat

  const index = Number(repeatedInput.slice(0, 7).join(""));

  let phase = 1;
  while (phase <= 100) {
    for (let i = repeatedInput.length - 1; i >= index; i--) {
      // console.log(`Phase: ${phase}, Iteration: ${i.toLocaleString()} -> ${index.toLocaleString()}`);
      repeatedInput[i] = ((repeatedInput[i + 1] || 0) + repeatedInput[i]) % 10;
    }
    phase++;
  }
  return repeatedInput.slice(index, index + 8);
};

const testCases2 = [
  [
    "03036732577212944063491565474664".split("").map(Number),
    "84462026".split("").map(Number)
  ],
  [
    "02935109699940807407585447034323".split("").map(Number),
    "78725270".split("").map(Number)
  ],
  [
    "03081770884921959731165446850517".split("").map(Number),
    "53553731".split("").map(Number)
  ]
];

console.log(chalk.blue("** Running test cases **"));
testCases2.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main2(input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (JSON.stringify(answer) !== JSON.stringify(output)) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result2 = main2(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result2.join("")}`));
