import chalk from "chalk";
import select from "@inquirer/select";

import {
  FLOW_FOLDER_NAME,
  MAESTRO_ROOT_FOLDER_POSSIBILITIES,
  SUBFLOW_FOLDER_NAME,
  HELPER_FOLDER_NAME,
  FSH_FOLDER_NAMES,
} from "../constant";
import { createFile, createFolder, getPath } from "../utils/system";
import { emptyLine, log } from "../utils/log";
import { wrapperTryCatchEEXIST } from "../utils/util";

export const init = async () => {
  const folderName = await select({
    message: "Select the root folder name for Maestro",
    choices: MAESTRO_ROOT_FOLDER_POSSIBILITIES.map((folderName) => ({
      name: folderName,
      value: folderName,
    })),
  });

  const path = getPath();
  const maestroRootPath = `${path}/${folderName}`;

  wrapperTryCatchEEXIST(
    () => createFolder(maestroRootPath),
    () => log(chalk.yellowBright("⚠️ Maestro root folder already exists."))
  );

  FSH_FOLDER_NAMES.forEach((folderName) => {
    wrapperTryCatchEEXIST(
      () => createFolder(`${maestroRootPath}/${folderName}`),
      () => log(chalk.yellowBright(`⚠️ ${folderName} folder already exists.`))
    );
  });

  const contentConfigFile = ["flows:", "  - 'flows/*'"].join("\n");
  wrapperTryCatchEEXIST(
    () => createFile(maestroRootPath, "config", "yaml", contentConfigFile),
    () => {}
  );

  emptyLine();

  log(chalk.green("Maestro project initialized successfully"));
  log(`- ${folderName}`);
  log(`  - ${FLOW_FOLDER_NAME}`);
  log(`  - ${SUBFLOW_FOLDER_NAME}`);
  log(`  - ${HELPER_FOLDER_NAME}`);
  log(`  - config.yaml`);
};
