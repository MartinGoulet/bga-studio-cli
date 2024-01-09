import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import { getProjectName } from "../helpers/project";
import { replaceFile } from "../helpers/file";

interface ArgumentChoice {
    name: string;
    type: string;
    isRequired: string;
}

export const addAction = async () => {
    const game = getProjectName();
    if (!game) return;
    const lower = game.toLocaleLowerCase();

    const actionName = await input({ message: "Action name" });
    if (!actionName) return;

    const nbrArguments = await input({
        message: "Number of arguments",
        default: "1",
    });
    if (Number.isNaN(nbrArguments)) return;

    const args: ArgumentChoice[] = await getArgumentList(nbrArguments);

    replaceFile(`./${lower}.action.php`, (content) =>
        replaceGameAction(content, actionName, args)
    );
    replaceFile(`./modules/php/Traits/Actions.php`, (content) =>
        replaceTraitAction(content, actionName, args)
    );
};

async function getArgumentList(nbrArguments: string) {
    const args: ArgumentChoice[] = [];
    for (let index = 0; index < Number(nbrArguments); index++) {
        const newArgs = await input({
            message: `Name of argument ${index + 1}`,
        });
        const newType = await select({
            message: `Type of argument ${index + 1}`,
            choices: [
                { name: "int", value: "int" },
                { name: "int[]", value: "array_int" },
                { name: "bool", value: "bool" },
            ],
        });
        const isRequired = await select({
            message: `Is required`,
            choices: [
                { name: "yes", value: "true" },
                { name: "no", value: "false" },
            ],
            default: "yes",
        });
        args.push({ name: newArgs, type: newType, isRequired });
    }
    return args;
}

function replaceGameAction(
    content: string,
    actionName: string,
    args: ArgumentChoice[]
) {
    const argList = args
        .map(({ name, type, isRequired }) => {
            if (type === "array_int") {
                return `\$${name} = self::getArrayArgs(self::getArg( "${name}", ${getTypeJson(
                    type
                )}, ${isRequired} ));`;
            } else {
                return `\$${name} = self::getArg( "${name}", ${getTypeJson(
                    type
                )}, ${isRequired} );`;
            }
        })
        .join("\n       ");

    const addContent = `// TODO: defines your action entry points there
    public function ${actionName}() {
       self::setAjaxMode();     
       
       // Retrieve arguments
       ${argList}

       // Then, call the appropriate method in your game logic
       $this->game->checkAction('${actionName}');
       $this->game->${actionName}( ${args
        .map(({ name }) => `\$${name}`)
        .join(", ")} );

       self::ajaxResponse();
    }
    `;
    return content.replace(
        `// TODO: defines your action entry points there`,
        addContent
    );
}

function replaceTraitAction(
    content: string,
    actionName: string,
    args: ArgumentChoice[]
) {
    const argList = args
        .map(({ name, type }) => `${getTypePhp(type)} \$${name}`)
        .join(", ");

    const addContent = `
    public function ${actionName}(${argList}) {
       
        // Move to next state
        $this->gamestate->nextState();
    }
    
}
`;

    return content.substring(0, content.lastIndexOf("}")) + addContent;
}

const getTypeJson = (type: string) => {
    switch (type) {
        case "bool":
            return "AT_bool";
        case "int":
            return "AT_int";
        case "array_int":
            return "AT_numberlist";
    }
};

const getTypePhp = (type: string) => {
    switch (type) {
        case "bool":
            return "bool";
        case "int":
            return "int";
        case "array_int":
            return "array";
    }
};
