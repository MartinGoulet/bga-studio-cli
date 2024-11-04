import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import fs from "fs";
import { getProjectName } from "../helpers/project";
import { replaceFile } from "../helpers/file";

export const addState = async () => {
    const game = getProjectName();
    if (!game) return;
    const lower = game.toLocaleLowerCase();

    const stateName = await input({ message: "State name" });
    if (!stateName) return;

    const type = await select({
        message: "Type",
        choices: [
            { name: "activeplayer", value: "activeplayer" },
            { name: "game", value: "game" },
            { name: "multipleactiveplayer", value: "multipleactiveplayer" },
            { name: "client", value: "client" },
        ],
    });
    if (!type) return;

    const stateNameCapitalize =
        stateName.substring(0, 1).toUpperCase() + stateName.substring(1);

    const stateNameConstant = `st${stateNameCapitalize}`
        .split(/(?=[A-Z])/)
        .map((c) => c.toUpperCase())
        .join("_");

    let action = "";
    if (type !== "activeplayer" && type !== "client") {
        action = await input({
            message: "Action",
            default:
                type === "game"
                    ? `st${stateNameCapitalize}`
                    : "stMakeEveryoneActive",
        });
    }

    let args = "";
    if (type !== "game" && type !== "client") {
        const hasArgs = await select({
            message: "Args",
            choices: [
                { name: "yes", value: "y" },
                { name: "no", value: "n" },
            ],
            default: "yes",
        });

        if (hasArgs === "y") {
            args = await input({
                message: "Args name",
                default: `arg${stateNameCapitalize}`,
            });
        }
    }

    if (type === "client") {
        addClientStateFiles(stateName, stateNameCapitalize, game);
        return;
    }

    replaceFile(`./states.inc.php`, (content) =>
        replaceStateInc(
            content,
            stateName,
            type,
            action,
            args,
            stateNameConstant
        )
    );

    replaceFile(`./modules/php/constants.inc.php`, (content) =>
        replaceContantsInc(content, stateNameConstant)
    );

    if (action && action !== "stMakeEveryoneActive") {
        replaceFile(`./modules/php/Traits/States.php`, (content) =>
            replaceTraitStates(content, action, type)
        );
    }

    if (args) {
        replaceFile(`./modules/php/Traits/Args.php`, (content) =>
            replaceTraitArgs(content, args)
        );
    }

    const addClientState = await select({
        message: "Add client state",
        choices: [
            { name: "yes", value: "y" },
            { name: "no", value: "n" },
        ],
        default: type === "game" ? "no" : "yes",
    });

    if (addClientState === "y") {
        // tsconfig
        addClientStateFiles(stateName, stateNameCapitalize, game);
    }
};

function addClientStateFiles(
    stateName: string,
    stateNameCapitalize: string,
    game: string
) {
    // tsconfig
    const typescriptFile = stateName
        .split(/(?=[A-Z])/)
        .map((c) => c.toLowerCase())
        .join("-");

    replaceFile(`./tsconfig.json`, (content) =>
        replaceTsConfig(content, stateName, typescriptFile)
    );

    replaceFile(`./src/states/state-manager.ts`, (content) =>
        replaceStateManager(content, stateName, stateNameCapitalize)
    );

    fs.appendFileSync(
        `./src/states/${typescriptFile}.ts`,
        getClientStateCode(game, stateNameCapitalize)
    );
}

function replaceContantsInc(content: string, stateNameConstant: string) {
    const regexp = /const ST_[A-Z_]* = ((?!99)[0-9]*);/g;
    const matches = content.matchAll(regexp);
    let maxValue = 0;
    let maxValueString = "";
    for (const match of matches) {
        const val = Number(match[1]);
        if (val !== 99 && maxValue < val) {
            maxValue = val;
            maxValueString = match[0];
        }
    }
    maxValue += 1;

    if (maxValue == 2) {
        maxValueString = "const ST_END_GAME = 99;\n";
    }

    return content.replace(
        maxValueString,
        `${maxValueString}\nconst ${stateNameConstant} = ${maxValue};`
    );
}

function replaceStateInc(
    content: string,
    stateName: string,
    type: string,
    action: string,
    args: string,
    stateNameConstant: string
) {
    const properties: string[] = [];

    properties.push(`"name" => "${stateName}",`);

    if (type !== "game") {
        properties.push(
            `"description" => clienttranslate('\${actplayer} must play a card or pass'),`
        );
        properties.push(
            `"descriptionmyturn" => clienttranslate('\${you} must play a card or pass'),`
        );
    }

    properties.push(`"type" => "${type}",`);

    if (action) {
        properties.push(`"action" => "${action}",`);
    }

    if (args) {
        properties.push(`"args" => "${args}",`);
    }

    if (type !== "game") {
        properties.push(`"possibleactions" => [],`);
    }

    properties.push(`"transitions" => [],`);

    let addContent = `\n    ${stateNameConstant} => [
        ${properties.join("\n        ")}
    ],
];
`;

    return content.substring(0, content.lastIndexOf("];")) + addContent;
}

function replaceTraitArgs(content: string, argsName: string) {
    const addContent = `
    function ${argsName}() {
        return [

        ];
    }
    
}
`;

    return content.substring(0, content.lastIndexOf("}")) + addContent;
}

function replaceTraitStates(content: string, actionName: string, type: string) {
    const gamestate =
        type === "game"
            ? "$this->gamestate->nextState();"
            : "$this->gamestate->setPlayersMultiactive([$player_ids], '');";
    const addContent = `
    function ${actionName}() {
        
        ${gamestate}
    }
    
}
`;

    return content.substring(0, content.lastIndexOf("}")) + addContent;
}

function replaceTsConfig(content: string, stateName: string, filename: string) {
    const addContent = `"src/states/state-manager.ts",
        "src/states/${filename}.ts",`;

    return content.replace(`"src/states/state-manager.ts",`, addContent);
}

function replaceStateManager(
    content: string,
    stateName: string,
    stateNameCapitalize: string
) {
    const addContent = `this.states = {
         ${stateName}: new ${stateNameCapitalize}State(game),`;

    return content.replace(`this.states = {`, addContent);
}

function getClientStateCode(game: string, stateNameCapitalize: string) {
    const content = `class ${stateNameCapitalize}State implements StateHandler {

    constructor(private game: ${game}) {}

    onEnteringState(args: ${stateNameCapitalize}Args): void {
        if (!this.game.isCurrentPlayerActive()) return;
    }

    onLeavingState(): void {
        
    }

    onUpdateActionButtons(args: ${stateNameCapitalize}Args): void {
        
    }
}

interface ${stateNameCapitalize}Args {

}
`;
    return content;
}
