const chalk = require("chalk");

module.exports = class IntCode {
  constructor(code) {
    this.memory = code.slice();
    this.index = 0;
    this.relativeBase = 0;
    this.inputs = [];
    this.output = [];
    this.running = false;
    this.completed = false;
  }

  opCodes = {
    1: {
      name: "Add",
      parameters: [
        {
          name: "Number 1"
        },
        {
          name: "Number 2"
        },
        {
          name: "Output",
          preventImmediate: true
        }
      ],
      evaluate: ([number1, number2, output]) => {
        this.memory[output] = number1 + number2;
      }
    },
    2: {
      name: "Multiply",
      parameters: [
        {
          name: "Number 1"
        },
        {
          name: "Number 2"
        },
        {
          name: "Output",
          preventImmediate: true
        }
      ],
      evaluate: ([number1, number2, output]) => {
        this.memory[output] = number1 * number2;
      }
    },
    3: {
      name: "Request Input",
      consumesInput: true,
      parameters: [
        {
          name: "Output",
          preventImmediate: true
        }
      ],
      evaluate: ([output], input) => {
        if (input === undefined) {
          // Pause and wait for more input
          this.running = false;
          return { jumped: true };
        } else {
          this.inputs.shift();
          this.memory[output] = input;
        }
      }
    },
    4: {
      name: "Output",
      parameters: [
        {
          name: "Value"
        }
      ],
      evaluate: ([value]) => {
        this.output.push(value);
        console.log(value);
      }
    },
    5: {
      name: "Jump if true",
      parameters: [
        {
          name: "Value"
        },
        {
          name: "Jump Location"
        }
      ],
      evaluate: ([value, location]) => {
        if (value !== 0) {
          this.index = location;
          return { jumped: true };
        }
      }
    },
    6: {
      name: "Jump if false",
      parameters: [
        {
          name: "Value"
        },
        {
          name: "Jump Location"
        }
      ],
      evaluate: ([value, location]) => {
        if (value === 0) {
          this.index = location;
          return { jumped: true };
        }
      }
    },
    7: {
      name: "Check if less than",
      parameters: [
        {
          name: "Number 1"
        },
        {
          name: "Number 2"
        },
        {
          name: "Output",
          preventImmediate: true
        }
      ],
      evaluate: ([number1, number2, location]) => {
        const isTrue = number1 < number2;
        this.memory[location] = isTrue ? 1 : 0;
      }
    },
    8: {
      name: "Check if equal to",
      parameters: [
        {
          name: "Number 1"
        },
        {
          name: "Number 2"
        },
        {
          name: "Output",
          preventImmediate: true
        }
      ],
      evaluate: ([number1, number2, location]) => {
        const isTrue = number1 === number2;
        this.memory[location] = isTrue ? 1 : 0;
      }
    },
    9: {
      name: "Update relative base",
      parameters: [
        {
          name: "Amount"
        }
      ],
      evaluate: ([amount]) => {
        this.relativeBase += amount;
      }
    },
    99: {
      name: "Return",
      parameters: [],
      evaluate: () => {
        this.completed = true;
        this.running = false;
        console.log("Result", this.output[this.output.length - 1]);
        return this.output[this.output.length - 1];
      }
    }
  };

  getCurrentParameters = instruction => {
    const opCode = instruction % 100;
    // Interpret the full instruction to find parameter modes
    const parameterModes = String(Math.floor(instruction / 100))
      .padStart(3, "0")
      .split("")
      .map(Number);
    // Pull parameters from the opCode
    const { parameters } = this.opCodes[opCode];
    return parameters.map((p, ix) => {
      const mode = parameterModes[2 - ix];
      if (p.preventImmediate) {
        if (mode === 2) {
          return this.memory[this.index + 1 + ix] + this.relativeBase;
        } else {
          return this.memory[this.index + 1 + ix];
        }
      }
      if (mode === 2) {
        // Relative Mode
        const position = this.memory[this.index + 1 + ix] + this.relativeBase;
        return this.memory[position] || 0;
      } else if (mode === 1) {
        // Immediate Mode
        return this.memory[this.index + 1 + ix] || 0;
      } else {
        // Position Mode
        const position = this.memory[this.index + 1 + ix];
        return this.memory[position] || 0;
      }
    });
  };

  processNextInstruction = input => {
    const prevState = this.memory.slice();
    const prevIndex = this.index;
    // Get the current instruction
    const instruction = this.memory[this.index];
    // Parse the opCode
    const opCode = instruction % 100;

    // Bail early if unrecognized opCode
    if (!this.opCodes[opCode]) {
      this.completed = true;
      this.running = false;
      return undefined;
    }
    // Get the parameters
    const parameters = this.getCurrentParameters(instruction);

    // Evaluate the opCode
    const result = this.opCodes[opCode].evaluate(parameters, input);
    // Move
    if (!(result && result.jumped)) {
      this.index += parameters.length + 1;
    }

    // Debugging code
    if (false) {
      console.log("Op Code", opCode, "Parameters", parameters);

      console.log(
        this.memory
          .map((i, ix) => {
            if (i === prevState[ix]) return i;
            return chalk.green(i);
          })
          .map((i, ix) => {
            if (ix === prevIndex) {
              return chalk.bgGrey(i);
            }
            if (ix === this.index) {
              return chalk.bgBlue(i);
            }
            return i;
          })
          .join(", ")
      );
    }

    return result;
  };

  run = () => {
    this.running = true;
    let result = null;
    while (this.running) {
      result = this.processNextInstruction(this.inputs[0]);
    }
    if (this.completed) {
      return result;
    }
  };

  addInputs = inputs => {
    this.inputs.push(...inputs);
  };

  getMostRecentOutput = () => {
    return this.output[this.output.length - 1];
  };
};
