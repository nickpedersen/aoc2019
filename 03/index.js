const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .map(r => r.split(","));

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [["R8,U5,L5,D3", "U7,R6,D4,L4"].map(r => r.split(",")), 6],
  [
    [
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83"
    ].map(r => r.split(",")),
    159
  ],
  [
    [
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
    ].map(r => r.split(",")),
    135
  ]
];

const main = input => {
  // Break the input in to lines
  const convertToLines = path => {
    let x = 0;
    let y = 0;
    return path.map(i => {
      const direction = i[0];
      const distance = Number(i.slice(1));
      if (direction === "U") {
        y -= distance;
        return { direction: "vertical", start: y, end: y + distance, x };
      } else if (direction === "D") {
        y += distance;
        return { direction: "vertical", start: y - distance, end: y, x };
      } else if (direction === "L") {
        x -= distance;
        return { direction: "horizontal", start: x, end: x + distance, y };
      } else if (direction === "R") {
        x += distance;
        return { direction: "horizontal", start: x - distance, end: x, y };
      }
    });
  };

  // Find intersections
  // An intersection occurs when the lines are different directions
  const findIntersections = (baseLine, setOfLines) => {
    const intersectingLines = setOfLines
      .filter(l => l.direction !== baseLine.direction)
      .filter(l =>
        baseLine.direction === "vertical"
          ? l.start < baseLine.x &&
            l.end > baseLine.x &&
            baseLine.start < l.y &&
            baseLine.end > l.y
          : l.start < baseLine.y &&
            l.end > baseLine.y &&
            baseLine.start < l.x &&
            baseLine.end > l.x
      )
      .map(l =>
        baseLine.direction === "vertical"
          ? { x: baseLine.x, y: l.y }
          : { x: l.x, y: baseLine.y }
      );
    return intersectingLines;
  };
  const lines = input.map(convertToLines);
  const intersections = lines[0]
    .map(line => findIntersections(line, lines[1]))
    .reduce((prev, curr) => [...prev, ...curr], []);
  const distances = intersections.map(i => Math.abs(i.x) + Math.abs(i.y));

  return Math.min(...distances);
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

const result = main(puzzleInput);

console.log(chalk.bgMagenta(`Result: ${result}`));

console.log(chalk.yellow("** Part 2 **"));

const main2 = input => {
  // Break the input in to lines
  const convertToLines = path => {
    let x = 0;
    let y = 0;
    let totalDistance = 0;
    return path.map(i => {
      const direction = i[0];
      const distance = Number(i.slice(1));
      if (direction === "U") {
        y -= distance;
        totalDistance += distance;
        return {
          direction: "vertical",
          start: y,
          end: y + distance,
          x,
          totalDistance,
          backwards: true
        };
      } else if (direction === "D") {
        y += distance;
        totalDistance += distance;
        return {
          direction: "vertical",
          start: y - distance,
          end: y,
          x,
          totalDistance,
          backwards: false
        };
      } else if (direction === "L") {
        x -= distance;
        totalDistance += distance;
        return {
          direction: "horizontal",
          start: x,
          end: x + distance,
          y,
          totalDistance,
          backwards: true
        };
      } else if (direction === "R") {
        x += distance;
        totalDistance += distance;
        return {
          direction: "horizontal",
          start: x - distance,
          end: x,
          y,
          totalDistance,
          backwards: false
        };
      }
    });
  };

  // Find intersections
  // An intersection occurs when the lines are different directions
  const findIntersections = (baseLine, setOfLines) => {
    const intersectingLines = setOfLines
      .filter(l => l.direction !== baseLine.direction)
      .filter(l =>
        baseLine.direction === "vertical"
          ? l.start < baseLine.x &&
            l.end > baseLine.x &&
            baseLine.start < l.y &&
            baseLine.end > l.y
          : l.start < baseLine.y &&
            l.end > baseLine.y &&
            baseLine.start < l.x &&
            baseLine.end > l.x
      )
      .map(l => {
        // This is all the lines added together to the point of crossing
        let totalDistance = baseLine.totalDistance + l.totalDistance;

        // This is the point of collision
        const x = baseLine.direction === "vertical" ? baseLine.x : l.x;
        const y = baseLine.direction === "vertical" ? l.y : baseLine.y;

        // We need to subtract the parts of both lines that were not travelled to reach the collision
        if (baseLine.direction === "vertical") {
          const verticalOvershoot = baseLine.backwards
            ? l.y - baseLine.start
            : baseLine.end - l.y;

          const horizontalOvershoot = l.backwards
            ? baseLine.x - l.start
            : l.end - baseLine.x;

          totalDistance -= verticalOvershoot;
          totalDistance -= horizontalOvershoot;
        } else {
          const horizontalOvershoot = baseLine.backwards
            ? l.x - baseLine.start
            : baseLine.end - l.x;

          const verticalOvershoot = l.backwards
            ? baseLine.y - l.start
            : l.end - baseLine.y;

          totalDistance -= verticalOvershoot;
          totalDistance -= horizontalOvershoot;
        }

        return { totalDistance, x, y };
      });
    return intersectingLines;
  };
  const lines = input.map(convertToLines);
  const intersections = lines[0]
    .map(line => findIntersections(line, lines[1]))
    .reduce((prev, curr) => [...prev, ...curr], []);
  const distances = intersections.map(i => i.totalDistance);

  return Math.min(...distances);
};

const testCases2 = [
  [["R8,U5,L5,D3", "U7,R6,D4,L4"].map(r => r.split(",")), 30],
  [
    [
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83"
    ].map(r => r.split(",")),
    610
  ],
  [
    [
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
    ].map(r => r.split(",")),
    410
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

console.log(chalk.bgMagenta(`Result: ${result2}`));
