export const log = console.log;
import chalk from "chalk";

export const emptyLine = () => log("");

export const divider = (text: string) => log(chalk.yellowBright(">"), text);
