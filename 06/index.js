const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n");

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [
    `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`.split("\n"),
    42
  ]
];

const main = input => {
  const parents = input.reduce((prev, curr) => {
    const [parent, child] = curr.split(")");
    return {
      ...prev,
      [parent]: prev[parent] || "__root__", // __root__ indicates we can stop our traversal
      [child]: parent
    };
  }, {});
  const orbitLengths = Object.keys(parents).map(curr => {
    let parent = parents[curr];
    let distance = 0;
    while (parent !== "__root__") {
      distance++;
      parent = parents[parent];
    }
    return distance;
  });
  const totalOrbitLength = orbitLengths.reduce((prev, curr) => prev + curr, 0);
  return totalOrbitLength;
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

const result = main(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const main2 = input => {
  const parents = input.reduce((prev, curr) => {
    const [parent, child] = curr.split(")");
    return {
      ...prev,
      [parent]: prev[parent] || "__root__", // __root__ indicates we can stop our traversal
      [child]: parent
    };
  }, {});
  const parentChain = Object.keys(parents).reduce((prev, curr) => {
    let parent = parents[curr];
    let distance = 0;
    let nodeParents = [parent];
    while (parent !== "__root__") {
      distance++;
      nodeParents = [...nodeParents, parent];
      parent = parents[parent];
    }
    return { ...prev, [curr]: { distance, parents: nodeParents } };
  }, {});

  // Find the latest common parent
  const commonParents = parentChain["SAN"].parents.filter(p =>
    parentChain["YOU"].parents.includes(p)
  );

  // Find the distance to SAN and YOU for each parent
  const distanceBetween = commonParents.map(p => {
    const distanceToSan = parentChain["SAN"].parents.indexOf(p);
    const distanceToYou = parentChain["YOU"].parents.indexOf(p);
    return distanceToSan + distanceToYou;
  });
  console.log(distanceBetween);
  const minDistance = Math.min(...distanceBetween);
  return minDistance - 2; // Remove 2 since you just need to get to the same satelite
};

const testCases2 = [
  [
    `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`.split("\n"),
    4
  ]
];

console.log(chalk.blue("** Calculating **"));

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

const result2 = main2(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result2}`));
