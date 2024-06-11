import {
  FLOW_FOLDER_NAME,
  HELPER_FOLDER_NAME,
  SUBFLOW_FOLDER_NAME,
  MAESTRO_ROOT_FOLDER_POSSIBILITIES,
} from "../constant";
import { emptyLine, log, divider } from "../utils/log";
import { getListOfFolders, getPath, isFolderExists } from "../utils/system";
import chalk from "chalk";
import * as stringSimilarity from "string-similarity";

export const doctor = () => {
  const currentPath = getPath();
  divider("Checking root folder...");

  const maestroRootFolder = MAESTRO_ROOT_FOLDER_POSSIBILITIES.find((folder) =>
    isFolderExists(currentPath, folder)
  );

  if (!maestroRootFolder) {
    log(
      chalk.red("🔴 Maestro root folder is missing"),
      "use maestro-fsh init command to create the folders."
    );
    return;
  } else {
    log(chalk.green(`✅ Maestro root folder found: ${maestroRootFolder}`));
  }

  if (!maestroRootFolder) return;

  emptyLine();

  let FSHMissingFolder: string[] = [];
  divider("Checking FSH folders...");
  const maestroRootPath = `${currentPath}/${maestroRootFolder}`;

  const folders = getListOfFolders(maestroRootPath);

  [FLOW_FOLDER_NAME, SUBFLOW_FOLDER_NAME, HELPER_FOLDER_NAME].forEach(
    (folder) => {
      if (!isFolderExists(maestroRootPath, folder)) {
        log(chalk.red(`🔴 The folder ${folder} is missing.`));
        FSHMissingFolder.push(folder);

        const matches = stringSimilarity.findBestMatch(folder, folders);
        if (matches.bestMatch.rating > 0.5) {
          log(
            chalk.yellow(
              `Folder '${matches.bestMatch.target}' found, did you mean ${folder}?`
            )
          );
        }
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
