/*
 * @Author: kasora 
 * @Date: 2017-07-13 23:57:08 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-07-14 00:01:39
 */
'use strict';

const Sequelize = require('sequelize');

const { database } = require('../config');

const sequelize = new Sequelize(
  database.database,
  database.user,
  database.password,
  {
    // logging: false
    host: database.host,
    port: database.port,
    dialect: 'mysql'
  }
);

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
    // timestamps: false
  }
);

let init_db = async () => {
  User = await User.sync({ force: true });
  // User = await User.sync();
};

let insertUser = async () => {
  await User.create({ name: 'kasora' });
};

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