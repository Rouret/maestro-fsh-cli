#!/usr/bin/env node

import { Argument, Command } from "commander";
import { doctor } from "./commands/doctor";
import { emptyLine } from "./utils/log";
import { init } from "./commands/init";
import { FSH_FOLDER_NAMES } from "./constant";
import { create } from "./commands/create";

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

program.command("init").description("Init maestro project").action(init);

const createArgument = new Argument("<type>", "Type of the resource");
createArgument.choices(FSH_FOLDER_NAMES);

program
  .command("create")
  .description("Init maestro project")
  .addArgument(createArgument)
  .argument("<name>", "name of the file")
  .action(create);

program.parse(process.argv);
emptyLine();
