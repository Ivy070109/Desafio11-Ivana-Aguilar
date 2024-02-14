import * as url from 'url'
import dotenv from 'dotenv'
import { Command } from 'commander'

const commandLineOptions = new Command()
commandLineOptions
    .option('--port <port>')
    .option('--mode <mode>')
commandLineOptions.parse()

// ya puedo incluir sistemas de desarrollo de producción y desarrollo
switch (commandLineOptions.opts().mode) {
    case 'prod':
        dotenv.config({ path: './.env.prod' })
        break

    case 'devel':
    default:
        dotenv.config({ path: './.env.devel' })
}

const config = {
    __FILENAME: url.fileURLToPath(import.meta.url),
    __DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    PORT: commandLineOptions.opts().port || 8080,
    MONGOOSE_URL: process.env.MONGOOSE_URL_REMOTE,
    SECRET_KEY: process.env.SECRET_KEY,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_DDBB: process.env.MYSQL_DDBB,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASS: process.env.MYSQL_PASS,
    UPLOAD_DIR: 'public/img',
    GITHUB_AUTH: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: `http://localhost:${commandLineOptions.opts().port || 3000}/api/auth/githubcallback`
    },
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PERSISTENCE: process.env.PERSISTENCE,
    MODE: commandLineOptions.opts().mode || 'devel'
}

export default config 