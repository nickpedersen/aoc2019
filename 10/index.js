const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .map(l => l.split("").map(i => i === "#"));

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [
    `.#..#
.....
#####
....#
...##`
      .split("\n")
      .map(l => l.split("").map(i => i === "#")),
    [[3, 4], 8]
  ],
  [
    `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`
      .split("\n")
      .map(l => l.split("").map(i => i === "#")),
    [[5, 8], 33]
  ],
  [
    `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`
      .split("\n")
      .map(l => l.split("").map(i => i === "#")),
    [[1, 2], 35]
  ],
  [
    `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`
      .split("\n")
      .map(l => l.split("").map(i => i === "#")),
    [[6, 3], 41]
  ],
  [
    `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
      .split("\n")
      .map(l => l.split("").map(i => i === "#")),
    [[11, 13], 210]
  ]
];

const main = input => {
  // Find all asteroid locations
  const asteroids = input.reduce((prev, currLine, y) => {
    return [
      ...prev,
      ...currLine.reduce((prev, currItem, x) => {
        if (currItem) {
          return [...prev, { x, y }];
        }
        return prev;
      }, [])
    ];
  }, []);

  let highestCount = 0;
  let bestAsteroid = null;
  asteroids.forEach((asteroid, ix) => {
    const angles = asteroids
      .filter((a, ix2) => ix2 !== ix)
      .map(a => {
        return (Math.atan2(a.y - asteroid.y, a.x - asteroid.x) * 180) / Math.PI;
      });
    const uniqueAngles = angles.reduce((prev, curr) => {
      if (prev.includes(curr)) {
        return prev;
      }
      return [...prev, curr];
    }, []);
    if (uniqueAngles.length > highestCount) {
      highestCount = uniqueAngles.length;
      bestAsteroid = asteroid;
    }
  });
  return [[bestAsteroid.x, bestAsteroid.y], highestCount];
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

const [location, count] = main(puzzleInput);
console.log(chalk.bgMagenta(`Result: ${count}`));
console.log(chalk.bgMagenta(`Location: ${location}`));

console.log(chalk.yellow("** Part 2 **"));

console.log(chalk.blue("** Calculating **"));

const main2 = (input, x, y) => {
  // Find all asteroid locations
  const asteroids = input.reduce((prev, currLine, y) => {
    return [
      ...prev,
      ...currLine.reduce((prev, currItem, x) => {
        if (currItem) {
          return [...prev, { x, y }];
        }
        return prev;
      }, [])
    ];
  }, []);

  // Anchor the asteroid at the best one
  const asteroid = { x, y };
  const asteroidIx = asteroids.find(a => a.x === x && a.y === y);

  const relativeAsteroids = asteroids
    .filter((a, ix) => ix !== asteroidIx)
    .map(a => {
      return {
        ...a,
        angle:
          ((Math.atan2(asteroid.y - a.y, asteroid.x - a.x) * 180) / Math.PI +
            270) %
          360,
        distance: Math.sqrt((asteroid.y - a.y) ^ (2 + (asteroid.x - a.x)) ^ 2)
      };
    });

  const sortedAsteroids = relativeAsteroids
    .map(a => {
      const inLineAsteroids = relativeAsteroids
        .filter(b => b.angle === a.angle)
        .sort((a, b) => a.distance - b.distance);

      const rotationsRequired = inLineAsteroids.findIndex(
        b => b.x === a.x && b.y === a.y
      );
      return {
        ...a,
        angle: a.angle + 360 * rotationsRequired
      };
    })
    .sort((a, b) => a.angle - b.angle);

  // [1, 2, 3, 10, 20, 50, 100, 199, 200, 201, 299].forEach(i => {
  //   console.log(
  //     `${i}. ${sortedAsteroids[i - 1].x} ${sortedAsteroids[i - 1].y}`
  //   );
  // });
  const answer = sortedAsteroids[200 - 1];
  return answer.x * 100 + answer.y;
};

const testCases2 = [
  [
    [
      `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
        .split("\n")
        .map(l => l.split("").map(i => i === "#")),
      11,
      13
    ],
    802
  ]
];

console.log(chalk.blue("** Running test cases **"));
testCases2.forEach(([input, output], ix) => {
  console.log(chalk.blue(`** Test case ${ix + 1} **`));
  console.log(`Input: ${input}`);
  const answer = main2(...input);
  console.log(`Output: ${answer}`);
  console.log(`Expected: ${output}`);
  if (answer !== output) {
    throw new Error(chalk.red(`Test case ${ix + 1} failed.`));
  }
  console.log(chalk.green("** Passed **"));
});

console.log(chalk.blue("** Calculating **"));

const result2 = main2(puzzleInput, 20, 19);
console.log(result2);
console.log(chalk.bgMagenta(`Result: ${result2}`));
