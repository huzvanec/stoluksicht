import {execSync, spawnSync} from 'node:child_process';

const vars: Env = {
    REACT_APP_HEAD_HASH: head(),
    REACT_APP_API_BASE_URL: 'http://localhost:8080',
    REACT_APP_BUILD_TIME: new Date().toString()
};

function head(): string | null {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface Env {
    [key: string]: string | null;
}

function main(): void {
    console.log(vars);
    let varsStr: string[] = [];
    for (const [name, value] of Object.entries(vars))
        if (name && value) varsStr.push(`${name}=${value}`);

    spawnSync('cross-env', [...varsStr, 'react-scripts', 'build'], {stdio: 'inherit'});
}

main();