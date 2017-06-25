/*
 * @Author: kasora 
 * @Date: 2017-06-25 14:50:31 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-06-25 23:29:02
 */
'use strict';

let Koa = require('koa');
let Router = require('koa-router');

let app = new Koa();
let router = new Router();

router.use('/api', require('./api'));
app.use(router.routes());

app.listen(3001);
console.log('listen on 3001');

module.exports = app;
