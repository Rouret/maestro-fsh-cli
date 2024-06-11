import chalk from "chalk";
import select from "@inquirer/select";

import {
  FLOW_FOLDER_NAME,
  MAESTRO_ROOT_FOLDER_POSSIBILITIES,
  SUBFLOW_FOLDER_NAME,
  HELPER_FOLDER_NAME,
} from "../constant";
import { createFile, createFolder, getPath } from "../utils/system";
import { emptyLine, log } from "../utils/log";

const wrapperTryCatchEEXIST = (funcToExe: () => void, callBack: () => void) => {
  try {
    funcToExe();
  } catch (e) {
    //@ts-ignore
    if (e.code !== undefined && e.code === "EEXIST") {
      callBack();
    }
  }
};

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

  const foldersToCreate = [
    FLOW_FOLDER_NAME,
    SUBFLOW_FOLDER_NAME,
    HELPER_FOLDER_NAME,
  ];

  foldersToCreate.forEach((folder) => {
    wrapperTryCatchEEXIST(
      () => createFolder(`${maestroRootPath}/${folder}`),
      () => log(chalk.yellowBright(`⚠️ ${folder} folder already exists.`))
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
