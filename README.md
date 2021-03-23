# Koa-logging-middleware

This is a logging middleware for Koa.js server. It records every request in month-rotated log file in your specialized path.

```javascript
    const http = require('http');
    const Koa = require("koa");
    const app = new Koa();
    const logger = require('koa-logging-middleware');

    app.use(logger('./log/'));  //fill in the your log path as argument

    app.createServer(app.callback()).listen(80,()=>{
        console.log('server is listening on 80 port')
    })
```

## log format/fields

 `[date] <client ip> method status url type browser engine os architecture`
