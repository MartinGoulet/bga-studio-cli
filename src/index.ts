#!/usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import { initProject } from "./commands/project-init";
import { addState } from "./commands/add-state";
import { addNotification } from "./commands/add-notification";

console.log(figlet.textSync("BGA Studio Cli"));

const program = new Command("bga-studio-cli")
    .version("0.0.1")
    .description("Command line for bga studio project");

program
    .command("init")
    .description("Project initialization")
    .action(initProject);

program
    .command("add")
    .argument('<type>', 'type to add (state or notif)')
    .action((type, options) => {
        switch (type) {
            case 'state':
                addState();
                break;
            case 'notif':
                addNotification();
                break;
            case 'card':
                addState();
                break;
        }
        if(type === 'state') {
            addState();
        } else if(type === 'notif') {
            addNotification();
        }
    });

program.parse();
