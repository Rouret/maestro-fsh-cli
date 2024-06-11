import { log } from "../utils/log";
import {
  createFile,
  createFolder,
  getListOfFolders,
  getPath,
} from "../utils/system";
import { checkAndGetMaestroRootFolderName, checkConfig } from "./maestro-fsh";
import chalk from "chalk";
import select from "@inquirer/select";
import inquirer from "inquirer";
import { wrapperTryCatchEEXIST } from "../utils/util";

const tellAndCreateFolder = async (
  typePath: string,
  name: string
): Promise<void> => {
  const { folderName } = await inquirer.prompt([
    {
      type: "input",
      name: "folderName",
      message: "Enter the folder name:",
    },
  ]);

  wrapperTryCatchEEXIST(
    () => createFolder(`${typePath}/${folderName}`),
    () => {}
  );

  createFileYaml(`${typePath}/${folderName}`, folderName, name);
};

const createFileYaml = (
  finalPath: string,
  folderName: string,
  name: string
) => {
  wrapperTryCatchEEXIST(
    () => createFile(finalPath, name, "yaml", ""),
    () => log(chalk.yellowBright("⚠️ File already exists."))
  );

  log(chalk.green("Resource created successfully"));
  log(`- ${folderName}`);
  log(`  - ${name}.yaml`);
};

export const create = async (type: string, name: string) => {
  const path = getPath();
  checkConfig(path);

  const maestroRootFolderName = checkAndGetMaestroRootFolderName(path);
  const rootPath = `${path}/${maestroRootFolderName}/${type}`;

  const foldersInType = getListOfFolders(rootPath);

  if (foldersInType.length > 0) {
    const choices = foldersInType.map((folderName) => ({
      name: folderName,
      value: folderName,
    }));

    choices.push({ name: "Create new", value: "maestro-fsh-create" });
    // select or create
    const destinationFolderName = await select({
      message: "Select the right folder",
      choices: choices,
    });

    if (destinationFolderName === "maestro-fsh-create") {
      await tellAndCreateFolder(rootPath, name);
    }

    createFileYaml(
      `${rootPath}/${destinationFolderName}`,
      destinationFolderName,
      name
    );
  } else {
    await tellAndCreateFolder(rootPath, name);
  }
};
