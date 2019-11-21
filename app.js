//dependencies
const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const path = require('path')
const Pug = require('koa-pug')
const app = new Koa();
//dependencies

//Router
const homepageRoute = new Router({ prefix: '/' });
const loginRoute = new Router({ prefix: '/login' });
const newMemeRoute = new Router({ prefix: '/newMeme' });

require('./routes/index')({ homepageRoute });
require('./routes/login')({ loginRoute });
require('./routes/newMeme')({ newMemeRoute });
//Router

//Error handler
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});
//Error handler

//Addons
app.use(logger());

const pug = new Pug({
    viewPath: path.resolve(__dirname, './views'),
    basedir: './views',
    locals: { /* soon auth will be here */ },
    helperPath: [
      { _: require('underscore') }
    ],
    app: app 
  })
//Addons

//Routes
app.use(homepageRoute.routes());
app.use(homepageRoute.allowedMethods());

app.use(loginRoute.routes());
app.use(loginRoute.allowedMethods());

app.use(newMemeRoute.routes());
app.use(newMemeRoute.allowedMethods());
//Routes

const server = app.listen(3000);
module.exports = server;