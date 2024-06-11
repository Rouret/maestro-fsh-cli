import { FSH_FOLDER_NAMES } from "../constant";
import { emptyLine, log, divider } from "../utils/log";
import { getListOfFolders, getPath, isFolderExists } from "../utils/system";
import chalk from "chalk";
import * as stringSimilarity from "string-similarity";
import { checkAndGetMaestroRootFolderName } from "./maestro-fsh";

export const doctor = () => {
  const currentPath = getPath();
  divider("Checking root folder...");

  const maestroRootFolder = checkAndGetMaestroRootFolderName(currentPath);

  log(chalk.green(`✅ Maestro root folder found: ${maestroRootFolder}`));
  emptyLine();

  let FSHMissingFolder: string[] = [];
  divider("Checking FSH folders...");
  const maestroRootPath = `${currentPath}/${maestroRootFolder}`;

  const folders = getListOfFolders(maestroRootPath);

  FSH_FOLDER_NAMES.forEach((folder) => {
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
  });

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
