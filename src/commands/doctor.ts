import {
  FLOW_FOLDER_NAME,
  HELPER_FOLDER_NAME,
  SUBFLOW_FOLDER_NAME,
  MAESTRO_ROOT_FOLDER_POSSIBILITIES,
} from "../constant";
import { emptyLine, log, divider } from "../utils/log";
import { getPath, isFolderExists } from "../utils/system";
import chalk from "chalk";

const checkMaestroRootFolder = (currentPath: string): string | undefined => {
  divider("Checking root folder...");

  const folder = MAESTRO_ROOT_FOLDER_POSSIBILITIES.find((folder) =>
    isFolderExists(currentPath, folder)
  );

  if (!folder) {
    log(
      chalk.red("🔴 Maestro root folder is missing"),
      "use maestro-fsh init command to create the folders."
    );
    return;
  } else {
    log(chalk.green(`✅ Maestro root folder found: ${folder}`));
  }

  return folder;
};

export const doctor = () => {
  const currentPath = getPath();

  const folder = checkMaestroRootFolder(currentPath);
  if (!folder) return;

  emptyLine();

  let FSHMissingFolder: string[] = [];
  divider("Checking FSH folders...");
  const maestroRootPath = `${currentPath}/${folder}`;

  [FLOW_FOLDER_NAME, SUBFLOW_FOLDER_NAME, HELPER_FOLDER_NAME].forEach(
    (folder) => {
      if (!isFolderExists(maestroRootPath, folder)) {
        log(chalk.red(`🔴 The folder ${folder} is missing.`));
        FSHMissingFolder.push(folder);
      } else {
        log(chalk.green(`✅ The folder ${folder} is present`));
      }
    }
  );

  emptyLine();

  if (FSHMissingFolder.length > 0) {
    const missingFoldersString = FSHMissingFolder.join(" or ");
    log(
      chalk.red(
        `⚠ Please create a maestro root folder named ${missingFoldersString}.`
      )
    );

    log("Look at the documentation of maestro-fsh init for more information.");

    return;
  }

  log(chalk.green("✅ Everything is setup correctly"));
};
