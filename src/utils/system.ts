import fs from "fs";

export const getPath = () => process.cwd();

export const isFolderExists = (path: string, folderName: string): boolean => {
  const completePath = `${path}/${folderName}`;
  return fs.existsSync(completePath);
};

export const getListOfFolders = (path: string): string[] => {
  return fs.readdirSync(path);
};

export const createFolder = (path: string) => {
  fs.mkdirSync(path);
};

export const createFile = (
  path: string,
  filename: string,
  extension: string,
  content: string
) => {
  fs.writeFileSync(`${path}/${filename}.${extension}`, content);
};

export const setFirstLetterToUpperCase = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
