import {execSync, spawnSync} from 'node:child_process';

const vars: Map<string, string | null> = new Map();
vars.set('VITE_HEAD_HASH', head());
vars.set('VITE_API_BASE_URL', 'http://localhost:8080');
vars.set('VITE_BUILD_TIME', new Date().toString());

function head(): string | null {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function main(): void {
    console.log(vars);
    const varsStr: string[] = [];
    for (const [name, value] of vars)
        if (name && value) varsStr.push(`${name}=${value}`);

    const spwn = (exec: string[]) => spawnSync('cross-env', [...varsStr, ...exec], {stdio: 'inherit'});
    spwn(['tsc', '-b']);
    spwn(['vite', 'build']);
}

main();