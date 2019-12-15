const fs = require("fs");
const chalk = require("chalk");
const puzzleInput = parseInput(
  fs.readFileSync(__dirname + "/input.txt").toString()
);

function parseInput(input) {
  return input.split("\n").map(line => {
    const [inputs, outputs] = line.split(" => ");
    const parsedInputs = inputs.split(", ").map(i => {
      const [quantity, type] = i.trim().split(" ");
      return { quantity: Number(quantity), type };
    });
    const parsedOuputs = outputs.split(", ").map(i => {
      const [quantity, type] = i.trim().split(" ");
      return { quantity: Number(quantity), type };
    });
    return { inputs: parsedInputs, outputs: parsedOuputs };
  });
}

console.log(chalk.yellow("** Part 1 **"));

const testCases = [
  [
    parseInput(`10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`),
    31
  ],
  [
    parseInput(`9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`),
    165
  ],
  [
    parseInput(`157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`),
    13312
  ],
  [
    parseInput(`2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`),
    180697
  ],
  [
    parseInput(`171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`),
    2210736
  ]
];

const main = (
  input,
  startingResources = { FUEL: 1 },
  returnAllResources = false,
  increment = 1,
  preventSpendingOre = false
) => {
  const costs = {};

  // Reverse the lists into costs for each resource
  input.forEach(a => {
    costs[a.outputs[0].type] = a.inputs.map(i => ({
      type: i.type,
      inputQuantity: i.quantity,
      outputQuantity: a.outputs[0].quantity
    }));
  });
  // console.log(costs);

  const resources = { ...startingResources };
  // console.log(resources);
  while (
    Object.entries(resources).filter(
      ([resource, amount]) =>
        resource !== "ORE" && (increment > 0 ? amount > 0 : amount < 0)
    ).length
  ) {
    // Work backwards
    Object.keys(resources).forEach(r => {
      if (r === "ORE") return;
      if (increment > 0 ? resources[r] <= 0 : resources[r] >= 0) return;
      const cost = costs[r];
      // Turn the resource into its costs
      let amountToProduce = resources[r];
      // console.log(`Want to produce ${amountToProduce} ${r}`);

      if (!preventSpendingOre || !cost.find(c => c.type === "ORE")) {
        cost.forEach(c => {
          // console.log(
          //   `We can use ${c.inputQuantity} ${c.type} to make ${c.outputQuantity} ${r}`
          // );
          if (!resources[c.type]) resources[c.type] = 0;
          resources[c.type] += increment * c.inputQuantity;
        });
        resources[r] -= increment * cost[0].outputQuantity;
        // console.log(resources);
      }
    });
  }
  if (returnAllResources) {
    return resources;
  }
  return resources["ORE"];
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

const main2 = puzzleInput => {
  let oreConsumed = 0;
  let resources = { FUEL: 0 };
  let fuelCount = 0;

  let increment = 1000000;

  while (Math.abs(increment) >= 1) {
    console.log(`Increment: ${increment}`);
    console.log(
      `To produce ${fuelCount.toLocaleString()} it took ${oreConsumed.toLocaleString()} / ${Number(
        1000000000000
      ).toLocaleString()}`
    );
    while (
      increment > 0 ? oreConsumed < 1000000000000 : oreConsumed > 1000000000000
    ) {
      resources.FUEL += increment;
      fuelCount += increment;
      resources = main(puzzleInput, resources, true, increment);
      oreConsumed = resources.ORE;
      console.log(
        `To produce ${fuelCount.toLocaleString()} it took ${oreConsumed.toLocaleString()} / ${Number(
          1000000000000
        ).toLocaleString()}`
      );
    }

    increment /= -10;
  }

  return fuelCount - 1;
};

const testCases2 = [
  [
    parseInput(`157 ORE => 5 NZVS
  165 ORE => 6 DCFZ
  44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
  12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
  179 ORE => 7 PSHF
  177 ORE => 5 HKGWZ
  7 DCFZ, 7 PSHF => 2 XJWVT
  165 ORE => 2 GPVTF
  3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`),
    82892753
  ],
  [
    parseInput(`2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
  17 NVRVD, 3 JNWZP => 8 VPVL
  53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
  22 VJHF, 37 MNCFX => 5 FWMGM
  139 ORE => 4 NVRVD
  144 ORE => 7 JNWZP
  5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
  5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
  145 ORE => 6 MNCFX
  1 NVRVD => 8 CXFTF
  1 VJHF, 6 MNCFX => 4 RFSQX
  176 ORE => 6 VJHF`),
    5586022
  ],
  [
    parseInput(`171 ORE => 8 CNZTR
  7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
  114 ORE => 4 BHXH
  14 VRPVC => 6 BMBT
  6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
  6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
  15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
  13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
  5 BMBT => 4 WPTQ
  189 ORE => 9 KTJDG
  1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
  12 VRPVC, 27 CNZTR => 2 XDBXC
  15 KTJDG, 12 BHXH => 5 XCVML
  3 BHXH, 2 VRPVC => 7 MZWV
  121 ORE => 7 VRPVC
  7 XCVML => 6 RJRHP
  5 BHXH, 4 VRPVC => 5 LTCX`),
    460664
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
