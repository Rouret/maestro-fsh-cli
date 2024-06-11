import {
  FSH_FOLDER_NAMES,
  MAESTRO_ROOT_FOLDER_POSSIBILITIES,
} from "../constant";
import { log } from "../utils/log";
import { getListOfFolders, isFolderExists } from "../utils/system";
import chalk from "chalk";

export const getMaestroRootFolderName = (path: string): string | undefined => {
  return MAESTRO_ROOT_FOLDER_POSSIBILITIES.find((folder) =>
    isFolderExists(path, folder)
  );
};

export const checkAndGetMaestroRootFolderName = (
  path: string
): string | undefined => {
  const maestroRootFolder = getMaestroRootFolderName(path);

  if (!maestroRootFolder) {
    log(
      chalk.red("🔴 Maestro root folder is missing"),
      "use maestro-fsh init command to create the folders."
    );
    return;
  }

  return maestroRootFolder;
};

export const checkMaestroFSHFolder = (maestroRootPath: string): boolean => {
  const folders = getListOfFolders(maestroRootPath);

  return FSH_FOLDER_NAMES.every((folder) => folders.includes(folder));
};

export const checkMaestroFSHProject = (path: string): boolean => {
  const maestroRootFolderName = checkAndGetMaestroRootFolderName(path);
  if (!maestroRootFolderName) return false;

  const isMaestroFSHFoldersOk = checkMaestroFSHFolder(
    `${path}/${maestroRootFolderName}`
  );

  if (!isMaestroFSHFoldersOk) {
    return false;
  }

  return true;
};

export const checkConfig = (path: string): void => {
  const isConfigIsOk = checkMaestroFSHProject(path);
  if (!isConfigIsOk) {
    log(
      chalk.red("🔴 FSH folders are missing"),
      "use maestro-fsh doctor command to create the folders."
    );
    process.exit(1);
  }
};
