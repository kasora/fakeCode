/*
 * @Author: kasora 
 * @Date: 2017-06-25 22:22:01 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-06-25 23:42:39
 */
'use strict';

let Router = require('koa-router');
let utils = require('../../utils');

let router = new Router();

let setcookie = async (ctx, next) => {
  utils.testTools.setid(ctx.query.id);
  ctx.cookies.set('kasora', 'hi');
  ctx.response.status = 201
  ctx.body = { status: 'ok' };
};
let getcookie = async (ctx, next) => {
  let id = utils.testTools.getid();
  let greeting = ctx.cookies.get('kasora');
  if (greeting !== 'hi') {
    ctx.throw('cookie error', 401);
  }
  console.log('???');
  ctx.response.status = 200
  ctx.body = { status: 'ok', data: { id: id } };
};


router.post('/', setcookie);
router.get('/', getcookie);

module.exports = router.routes();

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
