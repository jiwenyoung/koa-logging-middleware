const path = require('path')
const Agent = require('ua-parser-js')
const fs = require('fs/promises')

module.exports = (pathname) => {
    return async (ctx, next) => {
        const log = {}

        /**
         * Get request log
         */
        log.client = ctx.request.ip
        log.url = ctx.request.href
        log.method = ctx.request.method

        /**
         * Parse user agent
         */
        const agent = new Agent(ctx.header['user-agent'])

        const browser = agent.getBrowser()
        log.browser = `${browser.name} ${browser.version}`

        const engine = agent.getEngine()
        log.engine = `${engine.name} ${engine.version}`

        const os = agent.getOS()
        log.os = `${os.name} ${os.version}`

        log.architecture = agent.getCPU().architecture

        await next()

        /**
         * Get reponse log
         */
        log.type = ctx.response.type
        log.status = ctx.response.status

        /**
         * Compose Date
         */
        const date = new Date();
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = (date.getHours() + 1)
        const minute = (date.getMinutes() + 1)
        const second = (date.getSeconds() + 1)
        log.date = `${year}-${month}-${day}/${hour}:${minute}:${second}`

        /**
         * Compose log string
         */
        const str = `[${log.date}] <${log.client}> ${log.method} ${log.status} ${log.url} (${log.type}) (${log.browser}) (${log.engine}) (${log.os}) (${log.architecture})`

        /**
         * Write into file
         */
        const file = path.join(pathname, `${year}-${month + 1}.log`)  //decide file name by date(year-month)
        await fs.appendFile(file, `${str}\n`)
    }
}