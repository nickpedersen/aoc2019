const chalk = require("chalk");

const day = 3;
console.log(chalk.bgBlue(`** Running day ${day} **`));

module.exports = require(`./${String(day).padStart(2, "0")}/`);
