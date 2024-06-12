import { emptyLine } from "../utils/log";
import {
  createFile,
  createFolder,
  getListOfFolders,
  getPath,
} from "../utils/system";
import {
  checkAndGetMaestroRootFolderName,
  checkConfig,
  displayRecapLine,
} from "./maestro-fsh";
import select from "@inquirer/select";
import inquirer from "inquirer";
import { wrapperTryCatchEEXIST } from "../utils/util";
import {
  FLOW_FOLDER_NAME,
  SUBFLOW_FOLDER_NAME,
  HELPER_FOLDER_NAME,
  SPACE,
} from "../constant";

const emptyFlowFile = [
  "appId: your.app.id",
  "name: FLOW_NAME",
  "---",
  "",
  "- launchApp",
].join("\n");
const emptySubFlowFile = ["name: SUBFLOW_NAME", "---"].join("\n");
const emptyHelperFile = ["name: HELPER_NAME", "---"].join("\n");

const getContentFileByType = (type: string) => {
  switch (type) {
    case FLOW_FOLDER_NAME:
      return emptyFlowFile;
    case SUBFLOW_FOLDER_NAME:
      return emptySubFlowFile;
    case HELPER_FOLDER_NAME:
      return emptyHelperFile;
    default:
      return "";
  }
};

const tellFolderName = async (): Promise<string> => {
  const { folderName } = await inquirer.prompt([
    {
      type: "input",
      name: "folderName",
      message: "Enter the folder name:",
    },
  ]);

  return folderName;
};

export const create = async (type: string, name: string) => {
  const path = getPath();
  checkConfig(path);

  var isFolderError = false;
  var isFileError = false;
  var destinationFolderName = "";

  const maestroRootFolderName = checkAndGetMaestroRootFolderName(path);
  const typeFolderPath = `${path}/${maestroRootFolderName}/${type}`;

  const foldersInType = getListOfFolders(typeFolderPath);

  // if no folder, create one
  if (foldersInType.length === 0) {
    destinationFolderName = await tellFolderName();
    isFolderError = wrapperTryCatchEEXIST(() =>
      createFolder(`${typeFolderPath}/${destinationFolderName}`)
    );

    isFileError = wrapperTryCatchEEXIST(() =>
      createFile(
        `${typeFolderPath}/${destinationFolderName}`,
        name,
        "yaml",
        getContentFileByType(type)
      )
    );
  } else {
    // Setup choices of folders
    const choices = foldersInType.map((folderName) => ({
      name: folderName,
      value: folderName,
    }));

    choices.push({ name: "Create new", value: "maestro-fsh-create" });

    let destinationFolderNameTemp = await select({
      message: "Select the right folder",
      choices: choices,
    });

    // if user wants to create a new folder
    if (destinationFolderNameTemp === "maestro-fsh-create") {
      destinationFolderName = await tellFolderName();
      isFolderError = wrapperTryCatchEEXIST(() =>
        createFolder(`${typeFolderPath}/${destinationFolderName}`)
      );
    } else {
      destinationFolderName = destinationFolderNameTemp;
    }

    // create file
    isFileError = wrapperTryCatchEEXIST(() =>
      createFile(
        `${typeFolderPath}/${destinationFolderName}`,
        name,
        "yaml",
        getContentFileByType(type)
      )
    );
  }

  emptyLine();
  displayRecapLine(false, `- ${maestroRootFolderName}`);
  displayRecapLine(isFolderError, `${SPACE}- ${destinationFolderName}`);
  displayRecapLine(isFileError, `${SPACE.repeat(2)}- ${name}.yaml`);
};
