/*
 * @Author: kasora 
 * @Date: 2017-07-13 21:24:11 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-07-16 17:38:59
 */
'use strict';

const Sequelize = require('sequelize');
const expect = require('chai').expect;

const { database } = require('../config');

const sequelize = new Sequelize(
  database.database,
  database.user,
  database.password,
  {
    // 设定日志输出的函数
    // 可以接受一个具体的函数也可以接受布尔值
    // 默认为console输出日志
    // logging: (log) => { console.log('hi', log); },
    logging: false,
    host: database.host,
    port: database.port,
    dialect: 'mysql'
  }
);

// 定义 user 模型
// 定义一个模型需要表名、字段与一些配置选项
let User = sequelize.define('user',
  {
    name: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING(500),
      defaultValue: 'hello'
    }
  },
  {
    // 默认为 false，sequelize 会默认为表名加上后缀s
    // 此例中，如果没有 freezeTableName 则数据库中表名为 users
    freezeTableName: true,
    // 如果开启，则会在每次新增或修改数据时
    // 更新对应的 createdAt 和 updatedAt 字段
    // 默认开启。
    // timestamps: false
  }
);

// 使模型与数据库中的表同步
let init_db = async () => {

  // 添加 force 来强制同步数据库
  // 具体行为是直接删表重建
  await User.sync({ force: true });

  // 温和型同步。
  // 假设数据库所有结构与模型定义的相同。
  // 如运行时发生错误则报错。
  // User = await User.sync();
};

// 插入一个数据
let insertUser = async () => {
  let userInfo = await User.create({ name: 'kasora' });
  // userInfo 此时是 User 的一个实例
  // 除了数据库中的字段，还有一些内置的方法与参数
  // get 方法可以取出指定的字段的值
  let userId = userInfo.get('id');
  expect(userId).to.be.an('Number');
  // 实例的 get 方法默认提取所有字段
  userInfo = userInfo.get();
};

// 获取刚插入的数据
let getUser = async () => {
  let userInfo = await User.findOne({ where: { name: 'kasora' } });
  userInfo = userInfo.get();
  return userInfo;
};

// 让我们开始吧
let start = async () => {
  await init_db();
  await insertUser();
  let userInfo = await getUser();
  expect(userInfo.name).to.be.equal('kasora');
  expect(userInfo.id).to.be.ok;
};

start();