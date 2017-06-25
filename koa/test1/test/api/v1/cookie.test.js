/*
 * @Author: kasora 
 * @Date: 2017-06-25 23:03:15 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-06-25 23:47:54
 */
'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;

let agent = supertest.agent(require('../../../server').listen());

describe('test koa', async () => {
  it('set', async () => {
    await agent
      .post('/api/v1/cookie?id=10')
      .expect(201);
    let data = await agent
      .get('/api/v1/cookie')
      .expect(200);
    data = data.body.data;
    expect(data.id).to.be.equal('10');
  });
});
