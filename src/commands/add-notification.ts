import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import fs from "fs";
import { getProjectName } from "../helpers/project";
import { replaceFile } from "../helpers/file";

interface ArgumentChoice {
    name: string;
    type: string;
}

export const addNotification = async () => {
    const game = getProjectName();
    if (!game) return;
    const lower = game.toLocaleLowerCase();

    const notifName = await input({ message: "Notification name" });
    if (!notifName) return;

    const notifNameCapitalize =
        notifName.substring(0, 1).toUpperCase() + notifName.substring(1);

    const nbrArguments = await input({
        message: "Number of others arguments (exclude $player_id)",
        default: "1",
    });
    if (Number.isNaN(nbrArguments)) return;

    const args: ArgumentChoice[] = await getArgumentList(nbrArguments);

    const durationInput = await input({
        message: "Duration in milliseconds (-1 is async, -2 is message)",
        default: "1000",
    });

    const duration = Number(durationInput);

    replaceFile(`./modules/php/Core/Notifications.php`, (content) =>
        replaceNotificationPhp(content, notifName, notifNameCapitalize, args, duration === -2)
    );
    if (duration > -2) {
        replaceFile(`./src/notification-manager.ts`, (content) =>
            replaceNotificationTs(content, notifNameCapitalize, duration)
        );

        fs.appendFileSync(
            `./src/notification-manager.d.ts`,
            getNotificationDefTs(notifNameCapitalize, args)
        );
    }
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
                { name: "bool", value: "bool" },
                { name: "string", value: "string" },
                { name: "int[]", value: "int[]" },
                { name: "string[]", value: "string[]" },
                { name: "bool[]", value: "bool[]" },
                { name: "Card", value: "Card" },
            ],
        });
        args.push({ name: newArgs, type: newType });
    }
    return [{ name: "player_id", type: "int" }, ...args];
}

function replaceNotificationPhp(
    content: string,
    notifName: string,
    notifNameCapitalize: string,
    args: ArgumentChoice[],
    isMessage: boolean,
) {
    const start = `class Notifications extends \\APP_DbObject {`;

    const argList = args
        .map(({ name, type }) => `${getTypePhp(type)} \$${name}`)
        .join(", ");

    const [player_id, ...argPhp] = args;

    const argListPhp = argPhp
        .map(({ name }) => `'${name}' => \$${name}`)
        .join(",\n        ");

    const notificationName = isMessage ? 'message' : `on${notifNameCapitalize}`;

    let addContent = "";
    if (argList.length === 1) {
        addContent = `static function ${notifName}(${argList}) {
        $message = clienttranslate('\${player_name} ...');
        self::notifyAll('${notificationName}', $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
        ]);
    }
    `;
    } else {
        addContent = `static function ${notifName}(${argList}) {
        $message = clienttranslate('\${player_name} ...');
        self::notifyAll('${notificationName}', $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            ${argListPhp}
        ]);
    }
    `;
    }
    return content.replace(start, `${start}\n\n    ${addContent}`);
}

function replaceNotificationTs(
    content: string,
    notifNameCapitalize: string,
    duration: number
) {
    const addRegister =
        duration >= 0
            ? `['on${notifNameCapitalize}', ${duration}],`
            : `['on${notifNameCapitalize}'],`;

    const indexEndNotifs = content.indexOf("];");

    let newContent =
        content.substring(0, indexEndNotifs) +
        `\n         ${addRegister}\n      ` +
        content.substring(indexEndNotifs);

    const isAsync = duration >= 0 ? "" : "async ";
    const newFunction = `private ${isAsync}notif_on${notifNameCapitalize}(args: Notif${notifNameCapitalize}Args) {

   }

   `;

    const indexSetupNofif = newContent.indexOf(
        "private setupNotifications(notifs: any) {"
    );

    newContent =
        newContent.substring(0, indexSetupNofif) +
        newFunction +
        newContent.substring(indexSetupNofif);

    return newContent;
}

function getNotificationDefTs(
    notifNameCapitalize: string,
    args: ArgumentChoice[]
) {
    const argList = args
        .map(({ name, type }) => `${name}: ${getTypeTs(type)};`)
        .join("\n    ");

    const addContent = `interface Notif${notifNameCapitalize}Args {
    ${argList}
}`;

    return addContent;
}

function getTypePhp(type: string) {
    if (type.endsWith("[]")) return "array";
    if (type === "Card") return "array";
    return type;
}

function getTypeTs(type: string) {
    switch (type) {
        case "int":
            return "number";
        case "int[]":
            return "number[]";
        default:
            return type;
    }
}
