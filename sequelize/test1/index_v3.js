/*
 * @Author: kasora 
 * @Date: 2017-09-21 20:01:47 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-09-21 23:22:09
 */

 // v3 版 sequelize 入门注释代码
'use strict';

const Sequelize = require('sequelize');
const expect = require('chai').expect;

const { database } = require('./../config');

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
      // 如果你想查阅 sequelize 类型与 sql 中的类型有何区别，可以参照下面的链接
      // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#data-types
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING(500),
      // 除了默认值之外，还有很多的约束定义，可以参照下面的链接
      // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#definition
      defaultValue: 'hello'

      // 同时 sequelize 提供了内置基于 validator.js 的字段验证功能，可以参照下面的链接
      // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#validations

      // sequelize 也提供了针对某一字段的 get/set 方法，可以参照下面的链接
      // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#helper-functions-for-use-inside-getter-and-setter-definitions
    }
  },
  {
    // 默认为 false，sequelize 会默认为表名加上后缀s
    // 此例中，如果没有 freezeTableName 则数据库中表名为 users
    freezeTableName: true,

    // 表的更多属性参数可以参照下面的链接
    // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#configuration

    // 除了表的属性以外，我们可以在这里自定义方法，以供 Model 或者 Instance 调用
    // 可以参考下面的链接
    // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#expansion-of-models
    // 其中 classMethods 定义的方法可以被 Model 对象调用
    // 而 instanceMethods 定义的方法则可以被改 Model 的 Instance 对象调用
  }
);

// 使模型与数据库中的表同步
let init_db = async () => {

  // 添加 force 来强制同步数据库
  // 具体行为是先 drop 表，后 create 表
  await User.sync({ force: true });

  // 温和型同步。
  // 假设数据库所有结构与模型定义的相同。
  // 如运行时发生错误则报错。
  // User = await User.sync();
};

let insertUser = async () => {
  // 插入一个数据
  // userInfo 此时是 User 的一个 Instance
  // Instance 对象除了包含结果中所有的字段，还有一些内置的方法与参数
  let userInfo = await User.create({ name: 'kasora' });

  // 例如 Instance 的 get 方法可以取出指定的字段的值
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

/**
 * 总结：
 * sequelize 中，数据库的每张表会抽象为一个 Model。
 * 对应上面的样例就是 User 对象
 * Model 对象提供了一些对表进行操作的方法
 * 例如 create/destroy/update/findAll 分别对应了数据库中的增删改查操作。
 * 在 sequelize V3 版本中，Model 可以提供的所有方法可以在这里找到
 * https://sequelize.readthedocs.io/en/v3/api/model/
 * 而 Model 中的方法执行之后返回的一般是该 Model 的 Instance 对象。
 * 对应上面的样例就是 userinfo。
 * 该对象会提供一些结果集读取以及处理的方法。
 * 当然你也可以手动为 Instance 添加自定义方法。
 * 在 sequelize V3 版本中，Instance 可以提供的所有方法可以在这里找到
 * https://sequelize.readthedocs.io/en/v3/api/instance/
 */
