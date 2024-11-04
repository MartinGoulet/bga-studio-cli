import { searchFile } from "./file";
import chalk from "chalk";
import fs from "fs";

export function getProjectName() {
    let filenames = searchFile(".", ".game.php");
    if (filenames.length === 0) {
        filenames = searchFile("./modules/php", "Game.php");
    }
    if (filenames.length === 1) {
        const content = fs.readFileSync(filenames[0], "utf-8");
        const rx = /class (\w+) extends Table/g;
        const project = rx.exec(content)!;
        console.log(project[1]);
        return project[1];
    } else {
        console.log(chalk.red("This directory is not a BGA project"));
        return null;
    }
}
