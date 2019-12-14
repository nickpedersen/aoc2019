const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .map(l => ({
    x: Number(l.split("x=")[1].split(", y=")[0]),
    y: Number(l.split("y=")[1].split(", z=")[0]),
    z: Number(l.split("z=")[1].split(">")[0])
  }));

console.log(puzzleInput);
console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [
    `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`
      .split("\n")
      .map(l => ({
        x: Number(l.split("x=")[1].split(", y=")[0]),
        y: Number(l.split("y=")[1].split(", z=")[0]),
        z: Number(l.split("z=")[1].split(">")[0])
      })),
    10,
    179
  ],

  [
    `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`
      .split("\n")
      .map(l => ({
        x: Number(l.split("x=")[1].split(", y=")[0]),
        y: Number(l.split("y=")[1].split(", z=")[0]),
        z: Number(l.split("z=")[1].split(">")[0])
      })),
    100,
    1940
  ]
];

const main = (input, steps) => {
  // Add velocities
  const moons = input.map(m => ({
    ...m,
    vx: 0,
    vy: 0,
    vz: 0
  }));
  for (let i = 0; i < steps; i++) {
    console.log(`Step ${i + 1}`);
    moons.forEach((moon, ix) => {
      // Apply all gravitation pulls to velocity
      moons
        .filter((m, ix2) => ix2 !== ix)
        .forEach(otherMoon => {
          if (otherMoon.x > moon.x) {
            moon.vx += 1;
          } else if (otherMoon.x < moon.x) {
            moon.vx -= 1;
          }
          if (otherMoon.y > moon.y) {
            moon.vy += 1;
          } else if (otherMoon.y < moon.y) {
            moon.vy -= 1;
          }
          if (otherMoon.z > moon.z) {
            moon.vz += 1;
          } else if (otherMoon.z < moon.z) {
            moon.vz -= 1;
          }
        });
    });
    // Move each moon
    moons.forEach(moon => {
      moon.x += moon.vx;
      moon.y += moon.vy;
      moon.z += moon.vz;
      console.log(
        `pos=<x=${moon.x}, y=${moon.y}, z=${moon.z}>, vel=<x=${moon.vx}, y=${moon.vy}, z=${moon.vz}>`
      );
    });
  }
  // Find the energy
  const totalEnergy = moons.reduce(
    (prev, curr) =>
      prev +
      (Math.abs(curr.vx) + Math.abs(curr.vy) + Math.abs(curr.vz)) *
        (Math.abs(curr.x) + Math.abs(curr.y) + Math.abs(curr.z)),
    0
  );

  return totalEnergy;
};

console.log(chalk.blue("** Running test cases **"));
testCases.forEach(([input, steps, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}, Iterations: ${steps}`);
  const answer = main(input, steps);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const answer = main(puzzleInput, 1000);
console.log(chalk.bgMagenta(`Result: ${answer}`));

console.log(chalk.yellow("** Part 2 **"));

const testCases2 = [
  [
    `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`
      .split("\n")
      .map(l => ({
        x: Number(l.split("x=")[1].split(", y=")[0]),
        y: Number(l.split("y=")[1].split(", z=")[0]),
        z: Number(l.split("z=")[1].split(">")[0])
      })),
    2772
  ],
  [
    `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`
      .split("\n")
      .map(l => ({
        x: Number(l.split("x=")[1].split(", y=")[0]),
        y: Number(l.split("y=")[1].split(", z=")[0]),
        z: Number(l.split("z=")[1].split(">")[0])
      })),
    4686774924
  ]
];

const main2 = input => {
  // Add velocities
  const moons = input.map(m => ({
    ...m,
    vx: 0,
    vy: 0,
    vz: 0
  }));

  const simulateAxis = axis => {
    let complete = false;
    let count = 0;
    while (!complete) {
      count++;
      // console.log(`${axis} - Step ${count}`);
      moons.forEach((moon, ix) => {
        // Apply all gravitation pulls to velocity
        moons
          .filter((m, ix2) => ix2 !== ix)
          .forEach(otherMoon => {
            if (otherMoon[axis] > moon[axis]) {
              moon[`v${axis}`] += 1;
            } else if (otherMoon[axis] < moon[axis]) {
              moon[`v${axis}`] -= 1;
            }
          });
      });
      moons.forEach(moon => {
        moon[axis] += moon[`v${axis}`];
      });
      if (
        moons.filter(
          (m, ix) => m[axis] === input[ix][axis] && m[`v${axis}`] === 0
        ).length === input.length
      ) {
        complete = true;
      }
    }
    return count;
  };
  const xLoop = simulateAxis("x");
  const yLoop = simulateAxis("y");
  const zLoop = simulateAxis("z");

  console.log(xLoop, yLoop, zLoop);

  // Find highest common factor
  let step = 0;
  let complete = false;
  while (!complete) {
    step += Math.max(xLoop, yLoop, zLoop);
    if (step % xLoop === 0 && step % yLoop === 0 && step % zLoop === 0) {
      complete = true;
    }
  }

  return step;
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
const result2 = main2(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${result2}`));
