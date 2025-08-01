import {Elysia} from "elysia";
import {swagger} from '@elysiajs/swagger'
import chalk from 'chalk';

import fs from 'fs';
import v1 from "./v1/group";
import {clerkPlugin} from "elysia-clerk";
import {Logestic} from "logestic";

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

console.log(chalk.blue("    ______                      ______      _          ___    ____  ____"));
console.log(chalk.blue("   / ____/___  _______  _______/ ____/___  (_)___     /   |  / __ \\/  _/"));
console.log(chalk.blue("  / /_  / __ \\/ ___/ / / / ___/ /   / __ \\/ / __ \\   / /| | / /_/ // /"));
console.log(chalk.blue(" / __/ / /_/ / /__/ /_/ (__  ) /___/ /_/ / / / / /  / ___ |/ ____// /"));
console.log(chalk.blue("/_/    \\____/\\___/\\__,_/____/\\____/\\____/_/_/ /_/  /_/  |_/_/   /___/"));
console.log("");
console.log(chalk.blue(`FocusCoin API | https://focuscoinapp.com/ | Version: ${packageJson.version}`));
console.log("");

const app = new Elysia()
    .use(clerkPlugin())
    .use(Logestic.preset('fancy'))
    .use(swagger({
        path: "/swagger",
        documentation: {
            info: {
                title: 'FocusCoin API Documentation',
                version: '1.0.0'
            },
            tags: [
                { name: 'App', description: 'General endpoints' },
                { name: 'User', description: 'User endpoints' },
                { name: 'Focus-session', description: 'Focus-session endpoints' }
            ]
        }
    }))
    .get("/", () => "FocusCoin API is Running...", {
        detail: {
            tags: ['App']
        }
    })
    .use(v1)
    .listen(3000);

console.log(chalk.green(`🪙 FocusCoin API is running at ${app.server?.hostname}:${app.server?.port} \n`));
