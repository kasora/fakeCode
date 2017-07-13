/*
 * @Author: kasora 
 * @Date: 2017-07-13 21:24:11 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-07-13 23:19:15
 */
'use strict';

const Sequelize = require('sequelize');

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
    // logging: false
    host: database.host,
    port: database.port,
    dialect: 'mysql'
  }
);

// 定义 user 模型
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
    freezeTableName: true,
    // 如果开启，则会在每次新增或修改数据时
    // 更新对应的 createdAt 和 updatedAt 字段
    // 默认开启。
    // timestamps: false
  }
);

// 使模型与数据库同步
let init_db = async () => {

  // 添加 force 来强制同步数据库
  // 具体行为是直接删表重建
  User = await User.sync({ force: true });

  // 温和型同步。
  // 假设数据库所有结构与模型定义的相同。
  // 如运行时发生错误则报错。
  // User = await User.sync();
};

// 插入一个数据
let insertUser = async () => {
  let userInfo = await User.create({ name: 'kasora' });
  userInfo = userInfo.get();
  console.log(userInfo);
};

// 获取刚插入的数据
let getUser = async () => {
  let userInfo = await User.findOne({ where: { name: 'kasora' } });
  userInfo = userInfo.get();
  console.log(userInfo);
};

// 让我们开始吧
let start = async () => {
  await init_db();
  await insertUser();
  await getUser();
};

start();