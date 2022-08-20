import { readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_FILE = 'config.json';

export default () => {
    const conf =  JSON.parse(readFileSync(join(__dirname, CONFIG_FILE), 'utf8'));
    console.log(process.env.NODE_ENV)
    return conf[process.env.NODE_ENV];
};