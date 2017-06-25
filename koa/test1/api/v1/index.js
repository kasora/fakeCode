/*
 * @Author: kasora 
 * @Date: 2017-06-25 22:22:01 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-06-25 23:00:51
 */
'use strict';

let Router = require('koa-router');

let router = new Router();

router.use('/cookie', require('./cookie'));

module.exports = router.routes();
