import fs from "fs";
import path from "path";
import os from "os";
import { getProjectName } from "../helpers/project";
import { install } from "../helpers/install";
import { copy } from "../helpers/copy";
import { input } from "@inquirer/prompts";

export const initProject = async () => {
    const projectName = getProjectName();
    if (!projectName) return;

    console.log(`Project name : ${projectName}`);

    const namespace = await input({message: 'Namespace', default: projectName});
    const lowername = projectName.toLocaleLowerCase();

    const appPath = path.resolve("./");

    copy(`**`, appPath, {
        cwd: `${__dirname}/../src/templates/project-init/`,
        rename: (basename) => {
            switch (basename) {
                case "game.action.php":
                    return `${lowername}.action.php`;
                case "game.tpl":
                    return `${lowername}_${lowername}.tpl`;
                case "game.php":
                    return `${lowername}.game.php`;
                case "game.ts":
                    return `${lowername}.ts`;
                case "game.d.ts":
                    return `${lowername}.d.ts`;
                case "game.scss":
                    return `${lowername}.scss`;
                default:
                    return basename;
            }
        },
        replace: (content: string) => {
            return content
                .replace(/\$\{Game\}/g, projectName)
                .replace(/\$\{game\}/g, projectName.toLocaleLowerCase())
                .replace(/\$\{Namespace\}/g, namespace);
        },
    });
   
    createPackageJson(projectName);
};


function createPackageJson(projectName: string) {
    const lower = projectName.toLocaleLowerCase();

    /** Create a package.json for the new project and write it to disk. */
    const packageJson: any = {
        name: projectName,
        version: "0.1.0",
        private: true,
        scripts: {
            "build:ts": "tsc",
            "build:scss": `sass --no-source-map src/${lower}.scss ${lower}.css`,
        },
        dependencies: {
            "bga-animations": "github:thoun/bga-animations#1.1.1",
            "bga-cards": "github:thoun/bga-cards#3.1.2",
            "bga-studio-mg": "^0.1.5",
        },
        devDependencies: {
            sass: "^1",
            typescript: "^5",
        },
    };

    fs.writeFileSync(
        "package.json",
        JSON.stringify(packageJson, null, 2) + os.EOL
    );

    install("npm", true);
}
