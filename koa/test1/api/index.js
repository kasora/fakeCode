/*
 * @Author: kasora 
 * @Date: 2017-06-25 22:22:01 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-06-25 23:12:35
 */
'use strict';

let Router = require('koa-router');

let router = new Router();

router.use('/v1', require('./v1'));

module.exports = router.routes();
