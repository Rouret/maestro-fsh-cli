#!/usr/bin/env node

import { Command } from "commander";
import { doctor } from "./commands/doctor";
import { emptyLine } from "./utils/log";

const program = new Command();
program
  .version("1.0.0")
  .description(
    "Maestro CLI for FSH model. Please go to the root of your project"
  );

program
  .command("doctor")
  .description("Check if the project is setup correctly")
  .action(doctor);

program.parse(process.argv);
emptyLine();

/* program.action(() => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What's your name?",
      },
    ])
    .then((answers) => {
      console.log(chalk.green(`Hey there, ${answers.name}!`));
    });
}); */
