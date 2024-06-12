import chalk from "chalk";
import select from "@inquirer/select";

import {
  MAESTRO_ROOT_FOLDER_POSSIBILITIES,
  FSH_FOLDER_NAMES,
} from "../constant";
import { createFile, createFolder, getPath } from "../utils/system";
import { emptyLine, log } from "../utils/log";
import { wrapperTryCatchEEXIST } from "../utils/util";
import { displayRecapLine } from "./maestro-fsh";

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

  const isRootFolderError = wrapperTryCatchEEXIST(() =>
    createFolder(maestroRootPath)
  );

  const fshFolderError: boolean[] = FSH_FOLDER_NAMES.map((folderName) =>
    wrapperTryCatchEEXIST(() =>
      createFolder(`${maestroRootPath}/${folderName}`)
    )
  );

  const contentConfigFile = ["flows:", "  - 'flows/*'"].join("\n");
  const isConfigFileError = wrapperTryCatchEEXIST(() =>
    createFile(maestroRootPath, "config", "yaml", contentConfigFile)
  );

  emptyLine();

  log(chalk.green("Maestro project initialized successfully"));
  displayRecapLine(isRootFolderError, `- ${folderName}`);
  fshFolderError.map((isError, index) =>
    displayRecapLine(isError, `  - ${FSH_FOLDER_NAMES[index]}`)
  );
  displayRecapLine(isConfigFileError, `  - config.yaml`);
};
