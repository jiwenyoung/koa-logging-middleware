const path = require('path')
const Agent = require('ua-parser-js')
const fs = require('fs/promises')

module.exports = (pathname) => {
    return async (ctx, next) => {
        const log = {}

        /**
         * Get request log
         */
        log.client = ctx.request.ip || 'unknown'
        log.url = ctx.request.href || 'unknown'
        log.method = ctx.request.method || 'unknown'

        /**
         * Parse user agent
         */
        const agent = new Agent(ctx.header['user-agent'])

        
        const browser = agent.getBrowser()
        const browser_name = browser.name || 'unknown'
        const browser_version = browser.version || 'unknown'
        log.browser = `${browser_name} ${browser_version}`

        const engine = agent.getEngine()
        const engine_name = engine.name || 'unknown'
        const engine_version = engine.version || 'unknown'
        log.engine = `${engine_name} ${engine_version}`  

        const os = agent.getOS()
        const os_name = os.name || 'unknown'
        const os_version = os.version || 'unknown'
        log.os = `${os_name} ${os_version}`

        log.architecture = agent.getCPU().architecture || 'unknown'

        await next()

        /**
         * Get reponse log
         */
        log.type = ctx.response.type || 'unknown'
        log.status = ctx.response.status || 'unknown'

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