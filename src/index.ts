#!/usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import {
    addAction,
    addCardManager,
    addNotification,
    addState,
    initProject,
} from "./commands";

console.log(figlet.textSync("BGA Studio Cli 2"));

const program = new Command("bga-studio-cli")
    .version("0.0.1")
    .description("Command line for bga studio project");

program
    .command("init")
    .description("Project initialization")
    .action(initProject);

program
    .command("add")
    .argument("<type>", "type to add (state or notif)")
    .action((type, options) => {
        switch (type) {
            case "action":
                addAction();
                break;
            case "state":
                addState();
                break;
            case "notif":
                addNotification();
                break;
            case "card":
                addCardManager();
                break;
        }
    });

program.parse();
